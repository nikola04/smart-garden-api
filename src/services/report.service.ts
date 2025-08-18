import { ReportRepository } from "@/repositories/reports.repository";
import { IReport } from "@/types/report";
import { IAggregatedSensorSnapshot, IAir, ILight, ISensorReport, ISoil } from "@/types/sensors";
import appConfig from "@/configs/app.config";
import { ProjectRepository } from "@/repositories/project.repository";
import config from "@/configs/app.config";

export class ReportService{
    private reportRepository: ReportRepository;
    private projectRepository: ProjectRepository;
    constructor(){
        this.reportRepository = new ReportRepository();
        this.projectRepository = new ProjectRepository();
    }

    public async getAggregatedSensorSnapshot(userId: string, projectId: string): Promise<IAggregatedSensorSnapshot|null> {
        const project = await this.projectRepository.getUserProjectById(userId, projectId);
        if(!project)
            throw new Error("project doesn't exist");

        const recentReports = await this.reportRepository.getRecentProjectReports(projectId, { limit: config.maxProjectDevices });
        if(recentReports.length === 0) return null;

        const checked: string[] = [];
        const latestUpdate = recentReports[0].reportedAt;
        const timeWindowMinutes = 45;
        const latestUpdateWindow = new Date(latestUpdate.getTime() - 45 * 60 * 1000); // hour before latest update

        const air: IAir = ({ temperature: 0, humidity: 0 });
        const soil: ISoil = ({ moisture: 0, sensors_used: 0 });
        const light: ILight = ({ value: 0, night: true });

        let n = 0;

        recentReports.forEach(report => { // in future should handle when device doesnt use specific sensor.
            if(report.reportedAt <= latestUpdateWindow || checked.includes(report.id)) return; // no need to check 2 reports from same device
            checked.push(report.id);
            air.temperature += report.air.temperature;
            air.humidity += report.air.humidity;
            soil.moisture += report.soil.moisture;
            soil.sensors_used += report.soil.sensors_used;
            light.value += report.light.value;
            n++;
        });

        air.temperature /= n;
        air.humidity /= n;
        soil.moisture /= n;
        light.value /= n;
        light.night = light.value <= config.sensors.light.threshold;

        return ({
            air,
            soil,
            light,
            basedOnReports: n,
            timeWindowMinutes,
            updatedAt: latestUpdate
        });
    }

    public async saveReport(deviceId: string, projectId: string, report: ISensorReport): Promise<IReport> {
        const lastReport = await this.reportRepository.getLastReport(deviceId);
        if (lastReport){
            const timeDiff = appConfig.reportIntervalS * 1000 - (Date.now() - lastReport.reportedAt.getTime());
            if (timeDiff > 0)
                throw new Error(`report too soon #${timeDiff}`);
        }

        const createdReport = await this.reportRepository.createReport(deviceId, projectId, report);
        if (!createdReport)
            throw new Error("report not created");

        return createdReport;
    }
}

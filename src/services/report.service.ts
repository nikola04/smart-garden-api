import { ReportRepository } from "@/repositories/reports.repository";
import { IReport } from "@/types/report";
import { IAggregatedSensorSnapshot, ISensorReport } from "@/types/sensors";
import appConfig from "@/configs/app.config";
import { ProjectRepository } from "@/repositories/project.repository";

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
        const snapshot = await this.reportRepository.getAggregatedSensorSnapshot(projectId);
        return snapshot;
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

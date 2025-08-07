import { ReportRepository } from "@/repositories/reports.repository";
import { IReport } from "@/types/report";
import { IAir, ISensorReport } from "@/types/sensors";
import appConfig from "@/configs/app.config";

export class ReportService{
    private reportRepository: ReportRepository;
    constructor(){
        this.reportRepository = new ReportRepository();
    }

    public async getLastAirReports(projectId: string, { last = 30 }:{
        last: number
    }): Promise<IAir[]> {
        return this.reportRepository.getAirReport(projectId, { last });
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

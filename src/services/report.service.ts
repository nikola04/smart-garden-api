import { ReportRepository } from "@/repositories/reports.repository";
import { ReportDocument } from "@/types/report";
import { ISensorReport } from "@/types/sensors";
import appConfig from "@/configs/app.config";

export class ReportService{
    private reportRepository: ReportRepository;
    constructor(){
        this.reportRepository = new ReportRepository();
    }

    public async saveReport(deviceId: string, projectId: string, report: ISensorReport): Promise<ReportDocument> {
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

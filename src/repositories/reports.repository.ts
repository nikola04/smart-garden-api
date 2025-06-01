import Report from "@/models/report.model";
import { IReport } from "@/types/report";
import { IAir, IBattery, ICharger, ILight, ISoil } from "@/types/sensors";

export class ReportRepository {
    private static instance: ReportRepository;
    constructor() {
        if (ReportRepository.instance) {
            return ReportRepository.instance;
        }
        ReportRepository.instance = this;
    }
    public async getLastReport(deviceId: string): Promise<IReport | null> {
        const report = await Report.findOne({ device: deviceId }).sort({ reportedAt: -1 });
        return report;
    }

    public async createReport(deviceId: string, projectId: string, { air, soil, light, battery, charger }: {
        air: IAir, soil: ISoil, light: ILight, battery: IBattery, charger: ICharger
    }): Promise<IReport | null> {
        const report = await Report.create({
            device: deviceId,
            project: projectId,
            air: air,
            soil: soil,
            light: light,
            battery: battery,
            charger: charger
        });
        return report;
    }
}

import Report from "@/models/report.model";
import { IReport } from "@/types/report";
import { IAggregatedSensorSnapshot, IAir, IBattery, ICharger, ILight, ISoil } from "@/types/sensors";
import { Types } from "mongoose";

export class ReportRepository {
    private static instance: ReportRepository;
    constructor() {
        if (ReportRepository.instance) {
            return ReportRepository.instance;
        }
        ReportRepository.instance = this;
    }

    public async getActiveDevices(projectId: string): Promise<{ id: string; lastActive: Date }[]>{
        const activeDelay = new Date(Date.now() - 45 * 60 * 1000);

        const devices = await Report.aggregate([
            {
                $match: {
                    reportedAt: { $gt: activeDelay },
                    project: new Types.ObjectId(projectId)
                }
            },
            { $group: { 
                _id: "$device",
                lastActive: { $max: "$reportedAt" }
            } }
        ]);

        return devices.map(d => ({
            id: d._id.toString(),
            lastActive: d.lastActive
        }));
    }

    public async getRecentProjectReports(projectId: string, { limit }: { limit: number }): Promise<IReport[]> {
        const reports = await Report.find({ project: projectId, }).limit(limit).sort({ reportedAt: -1 });
        return reports;
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

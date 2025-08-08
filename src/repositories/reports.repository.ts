import config from "@/configs/app.config";
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

    public async getActiveDevicesIDs(projectId: string): Promise<string[]>{
        const activeDelay = new Date(Date.now() - 45 * 60 * 1000);

        const devices = await Report.aggregate([
            {
                $match: {
                    reportedAt: { $gt: activeDelay },
                    project: new Types.ObjectId(projectId)
                }
            },
            { $group: { _id: "$device" } }
        ]);

        const ids = devices.map(device => device._id.toString());
        return ids.filter((id, ind) => ids.indexOf(id) === ind);
    }

    public async getAggregatedSensorSnapshot(projectId: string): Promise<IAggregatedSensorSnapshot | null> {
        const reports = await Report.find({ project: projectId, }).limit(config.maxProjectDevices).sort({ reportedAt: -1 });
        if(reports.length === 0) return null;

        const checked: string[] = [];
        const latestUpdate = reports[0].reportedAt;
        const timeWindowMinutes = 45;
        const latestUpdateWindow = new Date(latestUpdate.getTime() - 45 * 60 * 1000); // hour before latest update

        const air: IAir = ({ temperature: 0, humidity: 0 });
        const soil: ISoil = ({ moisture: 0, sensors_used: 0 });

        let n = 0;

        reports.forEach(report => {
            if(report.reportedAt <= latestUpdateWindow || checked.includes(report.id)) return;
            air.temperature += report.air.temperature;
            air.humidity += report.air.humidity;
            soil.moisture += report.soil.moisture;
            soil.sensors_used += report.soil.sensors_used;
            n++;
        });

        air.temperature /= n;
        air.humidity /= n;
        soil.moisture /= n;

        return ({
            air,
            soil,
            basedOnReports: n,
            timeWindowMinutes,
            updatedAt: latestUpdate
        });
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

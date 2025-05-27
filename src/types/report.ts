import { Types, Document } from "mongoose";
import { DeviceDocument } from "./device";
import { IAir, IBattery, ICharger, ILight, ISoil } from "./sensors";

export interface IReport {
    device: Types.ObjectId | DeviceDocument;
    air: IAir;
    soil: ISoil;
    light: ILight;
    battery: IBattery;
    charger: ICharger;
    reportedAt: Date;
}

export type ReportDocument = IReport & Document;

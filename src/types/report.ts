import { Document, Types } from "mongoose";
import { IDevice } from "./device";
import { IAir, IBattery, ICharger, ILight, ISoil } from "./sensors";

export interface IReport {
    id: string;
    device: Types.ObjectId | IDevice;
    air: IAir;
    soil: ISoil;
    light: ILight;
    battery: IBattery;
    charger: ICharger;
    reportedAt: Date;
}

export type ReportDocument = IReport & Document;

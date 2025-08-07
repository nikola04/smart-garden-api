import { Document, Types } from "mongoose";
import { IDevice } from "./device";
import { IAir, IBattery, ICharger, ILight, ISoil } from "./sensors";
import { IProject } from "./project";

export interface IReport {
    id: string;
    device: Types.ObjectId | IDevice;
    project: Types.ObjectId | IProject;
    air: IAir;
    soil: ISoil;
    light: ILight;
    battery: IBattery;
    charger: ICharger;
    reportedAt: Date;
}

export type ReportDocument = IReport & Document;

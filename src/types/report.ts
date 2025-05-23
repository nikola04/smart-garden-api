import { Types, Document } from "mongoose";
import { IDevice } from "./device";

export interface IReport {
    device: Types.ObjectId | IDevice;
    reportedAt: Date;
}

export type ReportDocument = IReport & Document;

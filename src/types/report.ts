import { Types } from "mongoose";
import { IDevice } from "./device";

export interface IReport {
    device: Types.ObjectId | IDevice;
    reportedAt: Date;
}

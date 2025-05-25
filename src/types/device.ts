import { Document, Types } from "mongoose";
import { IUser } from "./user";

export enum DeviceType {
    ESP32 = "ESP32",
    Arduino = "Arduino"
}

export interface IDevice {
    name?: string;
    type: DeviceType;
    user: Types.ObjectId | IUser;
    addedAt: Date;
}

export type DeviceDocument = IDevice & Document;

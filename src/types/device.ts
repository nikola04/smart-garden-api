import { Document, Types } from "mongoose";
import { IUser } from "./user";

export enum DeviceType {
    ESP32 = "ESP32"
}

export interface IDevice {
    name?: string;
    deviceType: DeviceType;
    user: Types.ObjectId | IUser;
    addedAt: Date;
}

export type DeviceDocument = IDevice & Document;

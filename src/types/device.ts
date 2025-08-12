import { Document, Types } from "mongoose";
import { IUser } from "./user";
import { IProject } from "./project";

export enum DeviceType {
    ESP32 = "ESP32",
    Arduino = "Arduino"
}

export interface IDevice {
    id: string;
    name?: string;
    type: DeviceType;
    user: Types.ObjectId | IUser;
    project: Types.ObjectId | IProject;
    addedAt: Date;
    isActive?: boolean;
    lastActive?: Date;
}

export type DeviceDocument = IDevice & Document;

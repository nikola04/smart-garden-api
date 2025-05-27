import { Document, Types } from "mongoose";
import { UserDocument } from "./user";
import { ProjectDocument } from "./project";

export enum DeviceType {
    ESP32 = "ESP32",
    Arduino = "Arduino"
}

export interface IDevice {
    id: string;
    name?: string;
    type: DeviceType;
    user: Types.ObjectId | UserDocument;
    project: Types.ObjectId | ProjectDocument;
    addedAt: Date;
}

export type DeviceDocument = IDevice & Document;

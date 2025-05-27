import { Types, Document } from "mongoose";
import { DeviceDocument } from "./device";

export interface IAPIKey {
    key: string;
    device: Types.ObjectId | DeviceDocument;
    expiresAt: Date | null;
    createdAt: Date;
}

export type APIKeyDocument = IAPIKey & Document;

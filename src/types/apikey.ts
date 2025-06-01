import { Types, Document } from "mongoose";
import { IDevice } from "./device";

export interface IAPIKey {
    id: string;
    key: string;
    device: Types.ObjectId | IDevice;
    expiresAt: Date | null;
    createdAt: Date;
}

export type APIKeyDocument = IAPIKey & Document;

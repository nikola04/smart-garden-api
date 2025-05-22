import { Types } from "mongoose";
import { IDevice } from "./device";

export interface IAPIKey {
    key: string;
    device: Types.ObjectId | IDevice;
    createdAt: Date;
}

import { Document, Types } from "mongoose";
import { IUser } from "./user";

export interface IProject {
    id: string;
    name: string;
    description?: string;
    user: Types.ObjectId | IUser;
    updatedAt: Date;
    createdAt: Date;
}

export type ProjectDocument = IProject & Document;

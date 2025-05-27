import { Document } from "mongoose";
import { UserDocument } from "./user";

export interface IProject {
    id: string;
    name: string;
    description?: string;
    user: string | UserDocument;
    updatedAt: Date;
    createdAt: Date;
}

export type ProjectDocument = IProject & Document;

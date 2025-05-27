import { Document, Types } from "mongoose";
import { UserDocument } from "./user";

export interface IToken {
    token: string;
    user: Types.ObjectId | UserDocument;
    createdAt: Date;
    refreshedAt: Date;
    expiresAt: Date;
}

export type TokenDocument = IToken & Document;

import { Document, Types } from "mongoose";
import { IUser } from "./user";

export interface IToken {
    token: string;
    user: Types.ObjectId | IUser;
    createdAt: Date;
    expiresAt: Date;
}

export type TokenDocument = IToken & Document;

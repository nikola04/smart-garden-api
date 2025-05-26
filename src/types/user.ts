import { Document } from "mongoose";

export interface IUser {
    id: string,
    email: string,
    password: string,
    name: string,
    avatar: string|null,
    createdAt: Date
}

export type UserDocument = IUser & Document;

import { Document } from "mongoose";

export interface IUser {
    id: string,
    email: string,
    password: string,
    googleId: string|null,
    name: string,
    avatar: string|null,
    createdAt: Date
}

export type UserDocument = IUser & Document;

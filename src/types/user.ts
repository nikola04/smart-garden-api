import { Document } from "mongoose";

export interface IUser{
    email: string,
    password: string,
    name: string,
    avatar: string|null,
    createdAt: Date
}

export type UserDocument = IUser & Document;

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

export type HealthStatus = "excellent"|"healthy"|"degraded"|"critical";
export interface IHealth {
    devices: {
        health: number,
        messages: { name: string, state: string }[]
    },
    sensors: {
        health: number,
        messages: { name: string, state: string }[]
    },
    overallHealth: number,
    status: HealthStatus
};

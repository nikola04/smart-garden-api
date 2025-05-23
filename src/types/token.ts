import { IUser } from "./user";

export interface IToken {
    token: string;
    user: null|IUser;
    createdAt: Date;
    expiresAt: Date;
}

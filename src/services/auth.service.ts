import { IUser } from "@/types/user";
import { UserRepository } from "../repositories/user.repository";
import { authConfig, authHandler } from "@/configs/auth";
import bcrypt from "bcrypt";
import crypto from "crypto";
import Token from "@/models/token.model";

export class AuthService{
    private userRepository: UserRepository;
    constructor(){
        this.userRepository = new UserRepository();
    }
    /**
     * Login user with email and password
     * @param email - User email
     * @param password - User password
     * @returns Promise User
     */
    public async login(email: string, password: string): Promise<{ user: IUser, accessToken: string, refreshToken: string, csrfToken: string }> {
        const user = await this.userRepository.getUserByEmail(email);
        if(!user)
            throw new Error("user not found");
        if(!this.validatePassword(password, user.password))
            throw new Error("invalid password");

        const accessToken = authHandler.generateAccessToken({ id: user._id });
        const { jwt: refreshToken, hashedToken } = authHandler.generateRefreshToken();
        const csrfToken = crypto.randomBytes(64).toString("hex");

        await this.saveRefreshToken(user.id, hashedToken);

        return ({
            user,
            accessToken,
            refreshToken,
            csrfToken
        });
    }
    private validatePassword(password: string, hashedPassword: string): boolean{
        return bcrypt.compareSync(password, hashedPassword);
    }
    private async saveRefreshToken(userId: string, hashedToken: string): Promise<void> {
        const token = new Token({
            user: userId,
            token: hashedToken,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + authConfig.refresh_token.expiry * 1000),
        });
        await token.save();
    }
}

import { IUser, UserDocument } from "@/types/user";
import { UserRepository } from "../repositories/user.repository";
import { authHandler } from "@/configs/auth.config";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { TokenRepository } from "@/repositories/token.repository";
import { hashRefreshTokenData } from "easy-token-auth";

export class AuthService{
    private userRepository: UserRepository;
    private tokenRepository: TokenRepository;
    constructor(){
        this.userRepository = new UserRepository();
        this.tokenRepository = new TokenRepository();
    }
    public async refresh(value: string): Promise<{ user: IUser, accessToken: string, refreshToken: string, csrfToken: string }> {
        const data = authHandler.verifyAndDecodeToken(value);
        const hashedData = hashRefreshTokenData(data);
        const token = await this.tokenRepository.getToken(hashedData, true);
        if(!token)
            throw new Error("token not found");

        const user = token.user as IUser;
        if(token.expiresAt <= new Date())
            throw new Error("token expired");

        const accessToken = authHandler.generateAccessToken({ id: user.id });
        const { hashedToken, jwt: refreshToken } = authHandler.generateRefreshToken();
        const csrfToken = crypto.randomBytes(64).toString("hex");

        await this.tokenRepository.updateToken(user.id, hashedToken);

        return ({ user, accessToken, refreshToken, csrfToken });
    }
    /**
     * Login user with email and password
     * @param email - User email
     * @param password - User password
     * @returns Promise User
     */
    public async login(email: string, password: string): Promise<{ user: UserDocument, accessToken: string, refreshToken: string, csrfToken: string }> {
        const user = await this.userRepository.getUserByEmail(email);
        if(!user)
            throw new Error("user not found");
        if(!this.validatePassword(password, user.password))
            throw new Error("invalid password");

        const accessToken = authHandler.generateAccessToken({ id: user._id });
        const { jwt: refreshToken, hashedToken } = authHandler.generateRefreshToken();
        const csrfToken = crypto.randomBytes(64).toString("hex");

        await this.tokenRepository.saveToken(user.id, hashedToken);

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
}

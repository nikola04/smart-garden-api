import { IUser, UserDocument } from "@/types/user";
import { UserRepository } from "../repositories/user.repository";
import { authHandler } from "@/configs/auth.config";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { TokenRepository } from "@/repositories/token.repository";
import { hashRefreshTokenData } from "easy-token-auth";
import { oauth2Client } from "@/configs/google.config";
import { OAuth2Client } from "google-auth-library";

export class AuthService{
    private userRepository: UserRepository;
    private tokenRepository: TokenRepository;
    private googleClient: OAuth2Client;
    constructor(){
        this.userRepository = new UserRepository();
        this.tokenRepository = new TokenRepository();
        this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
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

    private async loginUser(user: UserDocument): Promise<{ user: UserDocument, accessToken: string, refreshToken: string, csrfToken: string }> {
        const accessToken = authHandler.generateAccessToken({ id: user.id });
        const { jwt: refreshToken, hashedToken } = authHandler.generateRefreshToken();
        const csrfToken = crypto.randomBytes(64).toString("hex");

        await this.tokenRepository.saveToken(user.id, hashedToken);

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

        return this.loginUser(user);
    }

    private validatePassword(password: string, hashedPassword: string): boolean{
        return bcrypt.compareSync(password, hashedPassword);
    }

    public async loginGoogle(code: string): Promise<{ user: UserDocument, accessToken: string, refreshToken: string, csrfToken: string }> {
        const { tokens } = await oauth2Client.getToken(code);
        if(!tokens.id_token)
            throw new Error("token not retrieved");
        const googleUserId = await this.verifyGoogleToken(tokens.id_token);
        const user = await this.userRepository.getUserByGoogle(googleUserId);
        if(!user)
            throw new Error("user not found");
        
        return this.loginUser(user);
    }

    private async verifyGoogleToken(token: string): Promise<string>{
        const ticket = await this.googleClient.verifyIdToken({
            idToken: token,
        });
        const payload = ticket.getPayload();
        if(!payload) throw new Error('not verified')
        const userId = payload['sub'];
        return userId;
    }
}

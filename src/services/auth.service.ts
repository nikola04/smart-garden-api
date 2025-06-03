import { IUser } from "@/types/user";
import { UserRepository } from "../repositories/user.repository";
import { authHandler } from "@/configs/auth.config";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { TokenRepository } from "@/repositories/token.repository";
import { hashRefreshTokenData } from "easy-token-auth";
import { oauth2Client } from "@/configs/google.config";
import { OAuth2Client } from "google-auth-library";
import { Error } from "mongoose";
import { isMongoServerError } from "@/helpers/mongoose";

export class AuthService{
    private userRepository: UserRepository;
    private tokenRepository: TokenRepository;
    private googleClient: OAuth2Client;
    constructor(){
        this.userRepository = new UserRepository();
        this.tokenRepository = new TokenRepository();
        this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }

    private async hashPassword(password: string): Promise<string>{
        const salt = await bcrypt.genSalt(13);
        return bcrypt.hash(password, salt);
    }

    private async validatePassword(password: string, hashedPassword: string): Promise<boolean>{
        return bcrypt.compare(password, hashedPassword);
    }

    /**
     * Login user and return tokens for user to identify
     * @param user IUser object
     * @returns Generated access, refresh and csrf token for user account
     */
    private async loginUser(user: IUser): Promise<{ user: IUser, accessToken: string, refreshToken: string, csrfToken: string }> {
        const accessToken = authHandler.generateAccessToken({ id: user.id });
        const { jwt: refreshToken, hashedToken } = authHandler.generateRefreshToken();
        const csrfToken = crypto.randomBytes(64).toString("hex");

        await this.tokenRepository.saveToken(user.id, hashedToken);

        return ({ user, accessToken, refreshToken, csrfToken });
    }

    /**
     * Register user with name, email and password
     * @param name - User name
     * @param email - User email
     * @param password - User password
     * @returns Promise User
     */
    public async register(name: string, email: string, password: string): Promise<{ user: IUser, accessToken: string, refreshToken: string, csrfToken: string }> {
        const hashedPassword = await this.hashPassword(password);
        try{
            const user = await this.userRepository.registerUser(name, email, hashedPassword);
            return this.loginUser(user);
        } catch(err){
            if(isMongoServerError(err) && err.code === 11000)
                throw new Error("email already registered");
            throw err;
        }
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

        const isValidPswd = await this.validatePassword(password, user.password);
        if(!isValidPswd)
            throw new Error("invalid password");

        return this.loginUser(user);
    }

    /**
     * Login user with Google OAuth Code
     * @param code - google oauth code
     * @returns Promise User
     */
    public async loginGoogle(code: string): Promise<{ user: IUser, accessToken: string, refreshToken: string, csrfToken: string }> {
        const { tokens } = await oauth2Client.getToken(code).catch(_e => ({ tokens: null }));
        if(!tokens || !tokens.id_token)
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
        }).catch(_e => null);
        if(!ticket)
            throw new Error("error verifying");
        const payload = ticket.getPayload();
        if(!payload) throw new Error("not verified");
        const userId = payload["sub"];
        return userId;
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
}

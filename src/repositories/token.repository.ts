import { authConfig } from "@/configs/auth.config";
import Token from "@/models/token.model";
import { TokenDocument } from "@/types/token";

export class TokenRepository {
    private static instance: TokenRepository;
    constructor() {
        if (TokenRepository.instance) {
            return TokenRepository.instance;
        }
        TokenRepository.instance = this;
    }

    public async getToken(token: string, populate: boolean = false): Promise<TokenDocument|null> {
        const document = await Token.findOne({ token }).populate(populate ? "user" : "");
        return document;
    }

    public async saveToken(userId: string, hashedToken: string): Promise<void> {
        const token = new Token({
            user: userId,
            token: hashedToken,
            expiresAt: new Date(Date.now() + authConfig.refresh_token.expiry * 1000),
        });
        await token.save();
    }

    public async updateToken(userId: string, hashedToken: string): Promise<void> {
        await Token.updateOne({ user: userId }, { $set: {
            token: hashedToken,
            refreshedAt: new Date(),
            expiresAt: new Date(Date.now() + authConfig.refresh_token.expiry * 1000),
        }});
    }
}

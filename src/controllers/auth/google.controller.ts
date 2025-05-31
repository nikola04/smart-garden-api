import { authConfig } from "@/configs/auth.config";
import responseHelper from "@/helpers/response.helper";
import { AuthService } from "@/services/auth.service";
import { Request, Response } from "express";
import crypto from "crypto";
import { oauth2Client } from "@/configs/google.config";

const authService = new AuthService();

export const googleCallbackController = async (req: Request, res: Response): Promise<void> => {
    try{
        if(!req.query || !req.query.code || !req.query.state || typeof req.query.state !== "string" || typeof req.query.code !== "string")
            return responseHelper.error({ res, code: 400, message: "Invalid code." });

        const { code, _state } = req.query;

        // if(state != req.session.state)
        //     return responseHelper.error({ res, code: 400, message: "Invalid state." });

        const { user, accessToken, refreshToken, csrfToken } = await authService.loginGoogle(code);
        const userFormated = ({ id: user.id, name: user.name, avatar: user.avatar, email: user.email, createdAt: user.createdAt });

        const maxAge = authConfig.refresh_token.expiry * 1000;
        responseHelper.cookie({ res, name: "refresh_token", value: refreshToken, maxAge, path: "/api/auth" });
        responseHelper.cookie({ res, name: "csrf_token", value: csrfToken, maxAge });

        responseHelper.success({ res, message: "Login successful.", data: { user: userFormated, accessToken, csrfToken } });
    }catch(err){
        if(err instanceof Error){
            if(err.message === "user not found" || err.message === "invalid password")
                return responseHelper.error({ res, code: 404, message: "User not found." });
        }
        console.log(err);
        responseHelper.error({ res, code: 500, message: "Internal server error." });
    }
};

export const googleLoginController = async (req: Request, res: Response): Promise<void> => {
    const scopes = ["openid", "email", "profile"];
    try{
        const state = crypto.randomBytes(32).toString("hex");

        req.session.state = state;

        const authorizationUrl = oauth2Client.generateAuthUrl({
            access_type: "offline",
            scope: scopes,
            include_granted_scopes: true,
            state: state
        });

        return responseHelper.success({ res, message: "OK", data: { url: authorizationUrl }});
    }catch(err){
        console.log(err);
        responseHelper.error({ res, code: 500, message: "Internal server error." });

    }
};

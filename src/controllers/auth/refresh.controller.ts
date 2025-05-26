import { authConfig } from "@/configs/auth.config";
import responseHelper from "@/helpers/response.helper";
import { AuthService } from "@/services/auth.service";
import { ValidatorErrors } from "easy-token-auth";
import { Request, Response } from "express";

const authService = new AuthService();

export const refreshController = async (req: Request, res: Response): Promise<void> => {
    try{
        if(!req.cookies || !req.cookies.refresh_token || typeof req.cookies.refresh_token !== "string")
            return responseHelper.error({ res, code: 400, message: "No refresh token cookie" });
        const oldRefreshToken = req.cookies.refresh_token;
        const { user, accessToken, refreshToken, csrfToken } = await authService.refresh(oldRefreshToken);
        const userFormated = ({ id: user.id, name: user.name, avatar: user.avatar, email: user.email, createdAt: user.createdAt });

        const maxAge = authConfig.refresh_token.expiry * 1000;
        responseHelper.cookie({ res, name: "refresh_token", value: refreshToken, maxAge, path: "/api/auth" });
        responseHelper.cookie({ res, name: "csrf_token", value: csrfToken, maxAge });

        responseHelper.success({ res, message: "Refresh successful.", data: { user: userFormated, accessToken, csrfToken } });
    }catch(err){
        if(err instanceof Error){
            if(err.message === "token not found")
                return responseHelper.error({ res, code: 401, message: "Invalid refresh token. Token not found." });
            if(err.message === "token expired")
                return responseHelper.error({ res, code: 401, message: "Invalid refresh token. Token expired." });
        }
        if(err === ValidatorErrors.InvalidToken || err === ValidatorErrors.InvalidTokenStructure || err === ValidatorErrors.InvalidAlgorithm)
            return responseHelper.error({ res, code: 401, message: "Invalid refresh token." });
        if(err === ValidatorErrors.TokenExpired)
            return responseHelper.error({ res, code: 401, message: "Invalid refresh token. Token expired.." });
        if(err === ValidatorErrors.InvalidSecretOrKey || err === ValidatorErrors.TokenNotActive)
            return responseHelper.error({ res, code: 401, message: "Invalid refresh token. Token probably expired." });

        responseHelper.error({ res, code: 500, message: "Internal server error." });
    }
};

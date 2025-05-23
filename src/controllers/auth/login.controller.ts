import { authConfig } from "@/configs/auth";
import responseHelper from "@/helpers/response.helper";
import { AuthService } from "@/services/auth.service";
import { Request, Response } from "express";

const authService = new AuthService();

export const loginController = async (req: Request, res: Response): Promise<void> => {
    try{
        if(!req.body || !req.body.email || !req.body.password)
            return responseHelper.error({ res, code: 400, message: "Invalid request body." });

        const { email, password } = req.body;
        const { user, accessToken, refreshToken, csrfToken } = await authService.login(email, password);

        const maxAge = authConfig.refresh_token.expiry * 1000;
        responseHelper.cookie({ res, name: "refresh_token", value: refreshToken, maxAge, path: "/api/auth" });
        responseHelper.cookie({ res, name: "csrf_token", value: csrfToken, maxAge });

        responseHelper.success({ res, message: "Login successful.", data: { user, accessToken, csrfToken } });
    }catch(err){
        if(err instanceof Error){
            if(err.message === "user not found" || err.message === "invalid password")
                return responseHelper.error({ res, code: 404, message: "User not found." });
        }

        responseHelper.error({ res, code: 500, message: "Internal server error." });
    }
};

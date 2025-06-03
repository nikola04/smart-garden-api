import { authConfig } from "@/configs/auth.config";
import { logger } from "@/configs/logger.config";
import { formatIUser } from "@/formatters/user.formatter";
import responseHelper from "@/helpers/response.helper";
import { AuthService } from "@/services/auth.service";
import { Request, Response } from "express";

const authService = new AuthService();

export const loginController = async (req: Request, res: Response): Promise<void> => {
    try{
        const { email, password } = req.body as { email: string, password: string };

        const { user, accessToken, refreshToken, csrfToken } = await authService.login(email, password);
        const userFormated = formatIUser(user);

        const maxAge = authConfig.refresh_token.expiry * 1000;
        responseHelper.cookie({ res, name: "refresh_token", value: refreshToken, maxAge, path: "/api/auth" });
        responseHelper.cookie({ res, name: "csrf_token", value: csrfToken, maxAge });

        responseHelper.success({ res, message: "Login successful.", data: { user: userFormated, accessToken, csrfToken } });
    }catch(err){
        if(err instanceof Error){
            if(err.message === "user not found" || err.message === "invalid password")
                return responseHelper.error({ res, code: 404, message: "User not found." });
        }
        logger.error(`[loginController] ${err}`);
        responseHelper.error({ res, code: 500, message: "Internal server error." });
    }
};

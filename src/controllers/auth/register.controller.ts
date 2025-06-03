import { authConfig } from "@/configs/auth.config";
import { logger } from "@/configs/logger.config";
import responseHelper from "@/helpers/response.helper";
import { AuthService } from "@/services/auth.service";
import { Request, Response } from "express";

const authService = new AuthService();

export const registerController = async (req: Request, res: Response): Promise<void> => {
    try{
        const { name, email, password } = req.body as { name: string, email: string, password: string };

        const { user, accessToken, refreshToken, csrfToken } = await authService.register(name, email, password);
        const userFormated = ({ id: user.id, name: user.name, avatar: user.avatar, email: user.email, createdAt: user.createdAt });

        const maxAge = authConfig.refresh_token.expiry * 1000;
        responseHelper.cookie({ res, name: "refresh_token", value: refreshToken, maxAge, path: "/api/auth" });
        responseHelper.cookie({ res, name: "csrf_token", value: csrfToken, maxAge });

        responseHelper.success({ res, message: "Register successful.", data: { user: userFormated, accessToken, csrfToken } });
    }catch(err){
        if(err instanceof Error){
            if(err.message === "email already registered")
                return responseHelper.error({ res, code: 403, message: "Email already registered." });
        }
        logger.error(`[registerController] ${err}`);
        responseHelper.error({ res, code: 500, message: "Internal server error." });
    }
};

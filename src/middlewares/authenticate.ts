import { authHandler } from "@/configs/auth";
import responseHelper from "@/helpers/response.helper";
import { ValidatorErrors } from "easy-token-auth";
import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try{
        if (!req.headers || !req.headers.authorization)
            return responseHelper.error({ res, code: 401, message: "Unauthorized." });
        if (!req.cookies || !req.cookies.csrf_token || ((!req.query || !req.query.csrf) && !req.headers["x-csrf-token"]))
            return responseHelper.error({ res, code: 401, message: "Unauthorized." });
        const authHeader = req.headers.authorization;
        const csrfCookie = req.cookies.csrf_token;
        const csrf = req.headers["x-csrf-token"] ?? req.query.csrf;

        const token = authHeader.split(" ")[1];
        if (!token)
            return responseHelper.error({ res, code: 401, message: "Unauthorized." });
        if (csrfCookie !== csrf)
            return responseHelper.error({ res, code: 401, message: "CSRF token mismatch." });

        const data = authHandler.verifyAndDecodeToken(token);
        const userId = data.id;
        (req as AuthRequest).user = {
            id: userId
        };
        next();
    }catch (err) {
        if(err === ValidatorErrors.InvalidToken || err === ValidatorErrors.InvalidTokenStructure || err === ValidatorErrors.InvalidAlgorithm)
            return responseHelper.error({ res, code: 401, message: "Invalid authorization token." });
        if(err === ValidatorErrors.TokenExpired)
            return responseHelper.error({ res, code: 401, message: "Expired authorization token." });
        if(err === ValidatorErrors.InvalidSecretOrKey || err === ValidatorErrors.TokenNotActive)
            return responseHelper.error({ res, code: 401, message: "Invalid token or expired key." });

        return responseHelper.error({ res, code: 500, message: "Internal server error." });
    }
};

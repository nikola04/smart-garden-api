import responseHelper from "@/helpers/response.helper";
import { AuthRequest } from "@/middlewares/authenticate";
import { NextFunction, Response } from "express";
import { isValidObjectId } from "mongoose";

export const validateKeysRequest = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if(!req.params || !req.params.id)
        return responseHelper.error({ res, code: 400, message: "Device ID is required." });
    if(!isValidObjectId(req.params.id))
        return responseHelper.error({ res, code: 400, message: "Invalid device ID." });
    next();
};

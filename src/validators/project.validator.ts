import responseHelper from "@/helpers/response.helper";
import { AuthRequest } from "@/middlewares/authenticate";
import { NextFunction, Response } from "express";
import { isValidObjectId } from "mongoose";

export const validateProjectRequestBody = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if(!req.body || !req.body.name)
        return responseHelper.error({ res, code: 400, message: "Invalid request body" });
    if(req.body.name.length < 2 || req.body.name.length > 50)
        return responseHelper.error({ res, code: 400, message: "Project name must be between 2 and 50 characters" });
    if(req.body.description && req.body.description.length > 200)
        return responseHelper.error({ res, code: 400, message: "Project description must be less than 200 characters" });
    next();
};

export const validateProjectRequest = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if(!req.params || !req.params.id)
        return responseHelper.error({ res, code: 400, message: "Project ID is required." });
    if(!isValidObjectId(req.params.id))
        return responseHelper.error({ res, code: 400, message: "Invalid project ID." });
    next();
};

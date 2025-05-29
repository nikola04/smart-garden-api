import responseHelper from "@/helpers/response.helper";
import { AuthRequest } from "@/middlewares/authenticate";
import { NextFunction, Response } from "express";
import { isValidObjectId } from "mongoose";

export const validateProjectRequestBody = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if(!req.body || !req.body.name)
        return responseHelper.error({ res, code: 400, message: "Invalid request body" });
    if(!isValidProjectName(req.body.name))
        return responseHelper.error({ res, code: 400, message: "Project name must be between 2 and 30 a-Z characters, numbers or . _ -" });
    if(req.body.description && req.body.description.length > 100)
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

export const isValidProjectName = (name: string): boolean => {
    const nameRegex = /^[a-zA-Z0-9_.\-\s]{2,30}$/;
    return nameRegex.test(name);
};

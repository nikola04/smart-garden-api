import responseHelper from "@/helpers/response.helper";
import { AuthRequest } from "@/middlewares/authenticate";
import { DeviceType } from "@/types/device";
import { NextFunction, Response } from "express";
import { isValidObjectId } from "mongoose";

export const validateDeviceRequest = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if(!req.params || !req.params.id)
        return responseHelper.error({ res, code: 400, message: "Device ID is required." });
    if(!isValidObjectId(req.params.id))
        return responseHelper.error({ res, code: 400, message: "Invalid device ID." });
    next();
};

export const validateDeviceRequestBody = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if(!req.body || !req.body.name || typeof req.body.name !== "string" || !req.body.type || typeof req.body.type !== "string")
        return responseHelper.error({ res, code: 400, message: "Invalid request body." });

    const { name, type } = req.body;
    if(!isValidDeviceName(name))
        return responseHelper.error({ res, code: 400, message: "Invalid device name." });
    if(!isValidDeviceType(type))
        return responseHelper.error({ res, code: 400, message: "Invalid device type." });

    next();
};

export const isValidDeviceName = (name: string): boolean => {
    const nameRegex = /^[a-zA-Z0-9_.\-\s]{2,50}$/;
    return nameRegex.test(name);
};

export const isValidDeviceType = (type: string): type is DeviceType => {
    return Object.values(DeviceType).includes(type as DeviceType);
};

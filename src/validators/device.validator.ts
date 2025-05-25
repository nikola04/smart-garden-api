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

export const isValidDeviceName = (name: string): boolean => {
    const nameRegex = /^[a-zA-Z0-9_.-]{2,50}$/;
    return nameRegex.test(name);
};

export const isValidDeviceType = (type: string): type is DeviceType => {
    return Object.values(DeviceType).includes(type as DeviceType);
};

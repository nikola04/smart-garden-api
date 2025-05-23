import responseHelper from "@/helpers/response.helper";
import { AuthRequest } from "@/middlewares/authenticate";
import { DeviceService } from "@/services/device.service";
import { Response } from "express";
import { isValidObjectId } from "mongoose";

const deviceService = new DeviceService();

export const keyController = async (req: AuthRequest, res: Response): Promise<void> => {
    try{
        if(!req.user)
            return responseHelper.error({ res, code: 401, message: "Unauthorized." });
        if(!req.params || !req.params.id)
            return responseHelper.error({ res, code: 400, message: "Device ID is required." });
        if(!isValidObjectId(req.params.id))
            return responseHelper.error({ res, code: 400, message: "Invalid device ID." });

        const deviceId = req.params.id;
        const { rawKey } = await deviceService.createDeviceAPIKey(deviceId, req.user.id);

        return responseHelper.success({ res, code: 200, message: "API key created successfully.", data: { raw: rawKey } });
    }catch(err){
        if(err instanceof Error){
            if(err.message === "device not found")
                return responseHelper.error({ res, code: 404, message: "Device not found." });
            if(err.message === "not device owner")
                return responseHelper.error({ res, code: 403, message: "User Device not found." });
            if(err.message === "failed to create api key")
                return responseHelper.error({ res, code: 500, message: "Failed to create API Key." });
        }
        responseHelper.error({ res, code: 500, message: "Internal server error." });
    }
};

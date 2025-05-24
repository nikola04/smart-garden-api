import responseHelper from "@/helpers/response.helper";
import { AuthRequest } from "@/middlewares/authenticate";
import { DeviceService } from "@/services/device.service";
import { Response } from "express";

const deviceService = new DeviceService();

export const getKeysController = async (req: AuthRequest, res: Response): Promise<void> => {
    try{
        if(!req.user)
            return responseHelper.error({ res, code: 401, message: "Unauthorized." });

        const deviceId = req.params.id;
        const key = await deviceService.getAPIKeys(deviceId, req.user.id);
        const formated = ({ id: key.id, expiresAt: key.expiresAt, createdAt: key.createdAt });

        return responseHelper.success({ res, code: 200, message: "API key created successfully.", data: { key: formated } });
    }catch(err){
        if(err instanceof Error){
            if(err.message === "device not found")
                return responseHelper.error({ res, code: 404, message: "Device not found." });
            if(err.message === "not device owner")
                return responseHelper.error({ res, code: 403, message: "User Device not found." });
            if(err.message === "key not found")
                return responseHelper.error({ res, code: 403, message: "Device key not found." });
        }
        responseHelper.error({ res, code: 500, message: "Internal server error." });
    }
};


export const createKeyController = async (req: AuthRequest, res: Response): Promise<void> => {
    try{
        if(!req.user)
            return responseHelper.error({ res, code: 401, message: "Unauthorized." });

        const deviceId = req.params.id;
        const { rawKey } = await deviceService.createAPIKey(deviceId, req.user.id);

        return responseHelper.success({ res, code: 200, message: "API key created successfully.", data: { raw: rawKey } });
    }catch(err){
        if(err instanceof Error){
            if(err.message === "device not found")
                return responseHelper.error({ res, code: 404, message: "Device not found." });
            if(err.message === "not device owner")
                return responseHelper.error({ res, code: 403, message: "User Device not found." });
            if(err.message === "device has key")
                return responseHelper.error({ res, code: 500, message: "Device already has registered key." });
            if(err.message === "failed to create api key")
                return responseHelper.error({ res, code: 500, message: "Failed to create API Key." });
        }
        console.log(err);
        responseHelper.error({ res, code: 500, message: "Internal server error." });
    }
};

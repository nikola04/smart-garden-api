import responseHelper from "@/helpers/response.helper";
import { AuthRequest } from "@/middlewares/authenticate";
import { DeviceService } from "@/services/device.service";
import { Response } from "express";
import { isValidObjectId } from "mongoose";

const deviceService = new DeviceService();

export const getKeysController = async (req: AuthRequest, res: Response): Promise<void> => {
    try{
        if(!req.user)
            return responseHelper.error({ res, code: 401, message: "Unauthorized." });

        const deviceId = req.params.id;
        const keys = await deviceService.getAPIKeys(deviceId, req.user.id);
        const formated = keys.map(key => ({ id: key.id, expiresAt: key.expiresAt, createdAt: key.createdAt }));

        return responseHelper.success({ res, code: 200, message: "API key created successfully.", data: { keys: formated } });
    }catch(err){
        if(err instanceof Error){
            if(err.message === "device not found")
                return responseHelper.error({ res, code: 404, message: "Device not found." });
            if(err.message === "not device owner")
                return responseHelper.error({ res, code: 403, message: "User Device not found." });
        }
        responseHelper.error({ res, code: 500, message: "Internal server error." });
    }
};

export const createKeyController = async (req: AuthRequest, res: Response): Promise<void> => {
    try{
        if(!req.user)
            return responseHelper.error({ res, code: 401, message: "Unauthorized." });

        const deviceId = req.params.id;
        const { rawKey, apiKey } = await deviceService.createAPIKey(deviceId, req.user.id);
        const formatedKey = ({ id: apiKey.id, expiresAt: apiKey.expiresAt, createdAt: apiKey.createdAt });

        return responseHelper.success({ res, code: 200, message: "API key created successfully.", data: { raw: rawKey, key: formatedKey } });
    }catch(err){
        if(err instanceof Error){
            if(err.message === "device not found")
                return responseHelper.error({ res, code: 404, message: "Device not found." });
            if(err.message === "not device owner")
                return responseHelper.error({ res, code: 403, message: "User Device not found." });
            if(err.message === "device has key")
                return responseHelper.error({ res, code: 403, message: "Device already has registered key." });
            if(err.message === "failed to create api key")
                return responseHelper.error({ res, code: 500, message: "Failed to create API Key." });
        }
        console.log(err);
        responseHelper.error({ res, code: 500, message: "Internal server error." });
    }
};

export const deleteKeyController = async (req: AuthRequest, res: Response): Promise<void> => {
    try{
        if(!req.params.keyId)
            return responseHelper.error({ res, code: 400, message: "Key ID is required." });
        if(!isValidObjectId(req.params.keyId))
            return responseHelper.error({ res, code: 400, message: "Invalid device ID." });
        if(!req.user)
            return responseHelper.error({ res, code: 401, message: "Unauthorized." });

        const deviceId = req.params.id;
        const keyId = req.params.keyId;
        await deviceService.deleteAPIKey(deviceId, keyId, req.user.id);

        return responseHelper.success({ res, code: 200, message: "API key deleted successfully." });
    }catch(err){
        if(err instanceof Error){
            if(err.message === "device not found")
                return responseHelper.error({ res, code: 404, message: "Device not found." });
            if(err.message === "not device owner")
                return responseHelper.error({ res, code: 403, message: "User Device not found." });
            if(err.message === "key not found")
                return responseHelper.error({ res, code: 404, message: "Key not found." });
        }
        console.log(err);
        responseHelper.error({ res, code: 500, message: "Internal server error." });
    }
};

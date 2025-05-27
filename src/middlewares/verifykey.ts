import responseHelper from "@/helpers/response.helper";
import { APIKeysRepository } from "@/repositories/apikeys.repository";
import { DeviceDocument } from "@/types/device";
import { hashKey } from "@/utils/apikey";
import { NextFunction, Request, Response } from "express";

const apiKeysRepository = new APIKeysRepository();

export interface DeviceRequest extends Request {
    device?: DeviceDocument;
    apiKey?: string;
}

export const verifyKey = async (req: DeviceRequest, res: Response, next: NextFunction): Promise<void> => {
    try{
        if (!req.headers || !req.headers["x-api-key"])
            return responseHelper.error({ res, code: 401, message: "Unauthorized." });
        const apiKeyHeader = req.headers["x-api-key"];
        const apiKey = Array.isArray(apiKeyHeader) ? apiKeyHeader[0] : apiKeyHeader;
        const key = await apiKeysRepository.findValidByKey(hashKey(apiKey), { populateDevice: true });
        if(!key || !key.device)
            return responseHelper.error({ res, code: 401, message: "Unauthorized." });

        (req as DeviceRequest).device = key.device as DeviceDocument;
        (req as DeviceRequest).apiKey = key.key;
        next();
    }catch(_err){
        return responseHelper.error({ res, code: 500, message: "Internal server error." });
    }
};

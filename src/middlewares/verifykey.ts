import responseHelper from "@/helpers/response.helper";
import { APIKeysRepository } from "@/repositories/apikeys.repository";
import { hashKey } from "@/utils/apikey";
import { NextFunction, Request, Response } from "express";

const apiKeysRepository = new APIKeysRepository();

export const verifyKey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        if (!req.headers || !req.headers["x-api-key"])
            return responseHelper.error({ res, code: 401, message: "Unauthorized." });
        const apiKeyHeader = req.headers["x-api-key"];
        const apiKey = Array.isArray(apiKeyHeader) ? apiKeyHeader[0] : apiKeyHeader;
        const key = await apiKeysRepository.findValidByKey(hashKey(apiKey));
        if(!key)
            return responseHelper.error({ res, code: 401, message: "Unauthorized." });
        next();
    }catch(_err){
        return responseHelper.error({ res, code: 500, message: "Internal server error." });
    }
};

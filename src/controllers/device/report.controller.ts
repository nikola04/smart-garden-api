import responseHelper from "@/helpers/response.helper";
// import { DeviceService } from "@/services/device.service";
import { Request, Response } from "express";

// const deviceService = new DeviceService();

export const reportController = async (req: Request, res: Response): Promise<void> => {
    try{
        responseHelper.success({ res, message: "OK" });
    }catch(_err){
        responseHelper.error({ res, code: 500, message: "Internal server error." });
    }
};

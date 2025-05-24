import responseHelper from "@/helpers/response.helper";
import { AuthRequest } from "@/middlewares/authenticate";
import { DeviceService } from "@/services/device.service";
import { Response } from "express";

const deviceService = new DeviceService();

export const getDevicesController = async (req: AuthRequest, res: Response): Promise<void> => {
    try{
        if(!req.user)
            return responseHelper.error({ res, code: 401, message: "Unauthorized." });

        const devices = await deviceService.getDevices(req.user.id);
        const formatedDevices = devices.map(device => ({ id: device.id, name: device.name, type: device.deviceType, addedAt: device.addedAt, userId: device.user.toString() }));

        return responseHelper.success({ res, code: 200, message: "Found user devices successfully.", data: { devices: formatedDevices } });
    }catch(_err){
        responseHelper.error({ res, code: 500, message: "Internal server error." });
    }
};

import responseHelper from "@/helpers/response.helper";
import { AuthRequest } from "@/middlewares/authenticate";
import { DeviceService } from "@/services/device.service";
import { isValidDeviceName, isValidDeviceType } from "@/validators/device.validator";
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

export const updateDeviceController = async (req: AuthRequest, res: Response): Promise<void> => {
    try{
        if(!req.body || !req.body.name || typeof req.body.name !== "string" || !req.body.type || typeof req.body.type !== "string")
            return responseHelper.error({ res, code: 400, message: "Invalid request body." });

        const { name, type } = req.body;
        if(!isValidDeviceName(name))
            return responseHelper.error({ res, code: 400, message: "Invalid device name." });
        if(!isValidDeviceType(type))
            return responseHelper.error({ res, code: 400, message: "Invalid device type." });

        if(!req.user)
            return responseHelper.error({ res, code: 401, message: "Unauthorized." });

        const deviceId = req.params.id;

        const device = await deviceService.updateDevice(deviceId, req.user.id, name, type);
        const formatedDevice = ({ id: device.id, name: device.name, type: device.deviceType, addedAt: device.addedAt, userId: device.user.toString() });

        return responseHelper.success({ res, code: 200, message: "Updated device successfully.", data: { device: formatedDevice } });
    }catch(err){
        if(err instanceof Error){
            if(err.message === "device not found")
                return responseHelper.error({ res, code: 404, message: "Device not found." });
        }
        responseHelper.error({ res, code: 500, message: "Internal server error." });
    }
};

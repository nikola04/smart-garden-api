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
        const formatedDevices = devices.map(device => ({ id: device.id, name: device.name, type: device.type, addedAt: device.addedAt, userId: device.user.toString() }));

        return responseHelper.success({ res, code: 200, message: "Found devices successfully.", data: { devices: formatedDevices } });
    }catch(_err){
        responseHelper.error({ res, code: 500, message: "Internal server error." });
    }
};

export const createDevicesController = async (req: AuthRequest, res: Response): Promise<void> => {
    try{
        if(!req.user)
            return responseHelper.error({ res, code: 401, message: "Unauthorized." });

        const { name, type } = req.body;
        const device = await deviceService.createDevice(req.user.id, name, type);
        const formatedDevice = ({ id: device.id, name: device.name, type: device.type, addedAt: device.addedAt, userId: device.user.toString() });

        return responseHelper.success({ res, code: 200, message: "Created devices successfully.", data: { device: formatedDevice } });
    }catch(err){
        if(err instanceof Error){
            if(err.name === "device not created")
                return responseHelper.error({ res, code: 500, message: "Error creating device."});
        }
        responseHelper.error({ res, code: 500, message: "Internal server error." });
    }
};

export const updateDeviceController = async (req: AuthRequest, res: Response): Promise<void> => {
    try{
        if(!req.user)
            return responseHelper.error({ res, code: 401, message: "Unauthorized." });

        const { name, type } = req.body;
        const deviceId = req.params.id;

        const device = await deviceService.updateDevice(deviceId, req.user.id, name, type);
        const formatedDevice = ({ id: device.id, name: device.name, type: device.type, addedAt: device.addedAt, userId: device.user.toString() });

        return responseHelper.success({ res, code: 200, message: "Updated device successfully.", data: { device: formatedDevice } });
    }catch(err){
        if(err instanceof Error){
            if(err.message === "device not found")
                return responseHelper.error({ res, code: 404, message: "Device not found." });
        }
        responseHelper.error({ res, code: 500, message: "Internal server error." });
    }
};

export const deleteDeviceController = async (req: AuthRequest, res: Response): Promise<void> => {
    try{
        if(!req.user)
            return responseHelper.error({ res, code: 401, message: "Unauthorized." });

        const deviceId = req.params.id;
        await deviceService.deleteDevice(deviceId, req.user.id);

        return responseHelper.success({ res, code: 200, message: "Deleted device successfully." });
    }catch(err){
        if(err instanceof Error){
            if(err.message === "device not found")
                return responseHelper.error({ res, code: 404, message: "Device not found." });
        }
        responseHelper.error({ res, code: 500, message: "Internal server error." });
    }
};

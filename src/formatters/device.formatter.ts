import { IDeviceDTO } from "@/dtos/device.dto";
import { IDevice } from "@/types/device";

export const formatIDevice = (device: IDevice): IDeviceDTO => {
    const userId = "id" in device.user && typeof device.user.id === "string" ? device.user.id : device.user.toString();
    return ({
        id: device.id,
        name: device.name,
        type: device.type,
        isActive: device.isActive,
        addedAt: device.addedAt,
        userId
    });
};

import { DeviceType } from "@/types/device";

export interface IDeviceDTO {
    id: string;
    name?: string;
    type: DeviceType;
    addedAt: Date;
    userId: string;
    isActive?: boolean;
}

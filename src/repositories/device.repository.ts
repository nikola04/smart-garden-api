import Device from "@/models/device.model";
import { DeviceDocument, DeviceType } from "@/types/device";

export class DeviceRepository {
    private static instance: DeviceRepository;
    constructor() {
        if (DeviceRepository.instance) {
            return DeviceRepository.instance;
        }
        DeviceRepository.instance = this;
    }
    public async getDeviceById(deviceId: string): Promise<DeviceDocument|null> {
        const device = await Device.findById(deviceId);
        return device;
    }
    public async createDevice(userId: string, name: string, type: DeviceType): Promise<DeviceDocument|null>{
        const device = await Device.create({
            user: userId,
            name,
            type
        });
        return device;
    }
    public async updateDevice(deviceId: string, userId: string, name: string, type: DeviceType): Promise<DeviceDocument|null>{
        const device = await Device.findOneAndUpdate({ _id: deviceId, user: userId }, { $set: { name, type }}, { returnDocument: "after" });
        return device;
    }
    public async deleteDevice(deviceId: string, userId: string): Promise<boolean>{
        const deleted = await Device.deleteOne({ _id: deviceId, user: userId });
        return deleted.deletedCount > 0;
    }
    public async getDevicesByUserId(userId: string): Promise<DeviceDocument[]>{
        const devices = await Device.find({ user: userId });
        return devices;
    }
}

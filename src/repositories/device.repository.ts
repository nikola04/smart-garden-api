import Device from "@/models/device.model";
import { DeviceType, IDevice } from "@/types/device";

export class DeviceRepository {
    private static instance: DeviceRepository;
    constructor() {
        if (DeviceRepository.instance) {
            return DeviceRepository.instance;
        }
        DeviceRepository.instance = this;
    }
    public async getDeviceById(deviceId: string): Promise<IDevice|null> {
        const device = await Device.findById(deviceId);
        return device;
    }
    public async createDevice(userId: string, projectId: string, name: string, type: DeviceType): Promise<IDevice|null>{
        const device = await Device.create({
            user: userId,
            project: projectId,
            name,
            type
        });
        return device;
    }
    public async updateDevice(deviceId: string, userId: string, name: string, type: DeviceType): Promise<IDevice|null>{
        const device = await Device.findOneAndUpdate({ _id: deviceId, user: userId }, { $set: { name, type }}, { returnDocument: "after" });
        return device;
    }
    public async deleteDevice(deviceId: string, userId: string): Promise<boolean>{
        const deleted = await Device.deleteOne({ _id: deviceId, user: userId });
        return deleted.deletedCount > 0;
    }
    public async getUserDevices(userId: string): Promise<IDevice[]>{
        const devices = await Device.find({ user: userId }).lean();
        return devices.map(device => ({ ...device, id: device._id.toString() }));
    }
    public async getProjectDevices(userId: string, projectId: string): Promise<IDevice[]> {
        const devices = await Device.find({ user: userId, project: projectId }).lean();
        return devices.map(device => ({ ...device, id: device._id.toString() }));
    }
}

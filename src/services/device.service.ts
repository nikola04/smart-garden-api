import appConfig from "@/configs/app.config";
import { logger } from "@/configs/logger.config";
import { APIKeysRepository } from "@/repositories/apikeys.repository";
import { DeviceRepository } from "@/repositories/device.repository";
import { IAPIKey } from "@/types/apikey";
import { DeviceType, IDevice } from "@/types/device";
import { hashKey } from "@/utils/apikey";
import { randomBytes } from "crypto";

export class DeviceService{
    private deviceRepository: DeviceRepository;
    private apiKeyRepository: APIKeysRepository;
    constructor(){
        this.deviceRepository = new DeviceRepository();
        this.apiKeyRepository = new APIKeysRepository();
    }

    public async getDevices(userId: string): Promise<IDevice[]>{
        const devices = await this.deviceRepository.getUserDevices(userId);
        return devices;
    }

    public async createDevice(userId: string, projectId: string, name: string, type: DeviceType): Promise<IDevice> {
        const devices = await this.deviceRepository.getProjectDevices(userId, projectId);
        if(devices.length >= appConfig.maxProjectDevices)
            throw new Error("devices limit reached");

        if(devices.find((device) => device.name === name))
            throw new Error("name already used");

        const device = await this.deviceRepository.createDevice(userId, projectId, name, type);
        if(!device)
            throw new Error("device not created");
        return device;
    }

    public async updateDevice(deviceId: string, userId: string, name: string, type: DeviceType): Promise<IDevice> {
        const device = await this.deviceRepository.updateDevice(deviceId, userId, name, type);
        if(!device)
            throw new Error("device not found");
        return device;
    }

    public async deleteDevice(deviceId: string, userId: string): Promise<void> {
        const deleted = await this.deviceRepository.deleteDevice(deviceId, userId);
        if(!deleted)
            throw new Error("device not found");

        this.apiKeyRepository.deleteDeviceAPIKeys(deviceId).catch(err => {
            logger.error(`Failed to delete API keys for device ${deviceId}:`, err);
        });
    }

    public async getAPIKeys(deviceId: string, userId: string): Promise<IAPIKey[]>{
        const device = await this.deviceRepository.getDeviceById(deviceId);
        if(!device)
            throw new Error("device not found");

        if(device.user.toString() !== userId)
            throw new Error("not device owner");

        const key = await this.apiKeyRepository.findValidByDeviceId(deviceId);
        return key;
    }

    public async createAPIKey(deviceId: string, userId: string): Promise<{ rawKey: string, apiKey: IAPIKey }>{
        const device = await this.deviceRepository.getDeviceById(deviceId);
        if(!device)
            throw new Error("device not found");

        if(device.user.toString() !== userId)
            throw new Error("not device owner");

        const rawKey = randomBytes(32).toString("hex");
        const hash = hashKey(rawKey);
        const apiKey = await this.apiKeyRepository.createAPIKey(deviceId, hash);
        if(!apiKey)
            throw new Error("failed to create api key");
        return ({ rawKey, apiKey });
    }

    public async deleteAPIKey(deviceId: string, keyId: string, userId: string): Promise<true>{
        const device = await this.deviceRepository.getDeviceById(deviceId);
        if(!device)
            throw new Error("device not found");

        if(device.user.toString() !== userId)
            throw new Error("not device owner");

        const deleted = await this.apiKeyRepository.deleteAPIKey(deviceId, keyId);
        if(!deleted)
            throw new Error("key not found");

        return deleted;
    }
}

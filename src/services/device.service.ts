import { APIKeysRepository } from "@/repositories/apikeys.repository";
import { DeviceRepository } from "@/repositories/device.repository";
import { APIKeyDocument } from "@/types/apikey";
import { DeviceDocument, DeviceType } from "@/types/device";
import { hashKey } from "@/utils/apikey";
import { randomBytes } from "crypto";

export class DeviceService{
    private deviceRepository: DeviceRepository;
    private apiKeyRepository: APIKeysRepository;
    constructor(){
        this.deviceRepository = new DeviceRepository();
        this.apiKeyRepository = new APIKeysRepository();
    }

    public async getDevices(userId: string): Promise<DeviceDocument[]>{
        const devices = await this.deviceRepository.getDevicesByUserId(userId);
        return devices;
    }

    public async updateDevice(deviceId: string, userId: string, name: string, type: DeviceType): Promise<DeviceDocument> {
        const device = await this.deviceRepository.updateDevice(deviceId, userId, name, type);
        if(!device)
            throw new Error("device not found");
        return device;
    }

    public async getAPIKeys(deviceId: string, userId: string): Promise<APIKeyDocument[]>{
        const device = await this.deviceRepository.getDeviceById(deviceId);
        if(!device)
            throw new Error("device not found");

        if(device.user.toString() !== userId)
            throw new Error("not device owner");

        const key = await this.apiKeyRepository.findValidByDeviceId(deviceId);
        return key;
    }

    public async createAPIKey(deviceId: string, userId: string): Promise<{ rawKey: string, apiKey: APIKeyDocument }>{
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

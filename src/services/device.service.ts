import { APIKeysRepository } from "@/repositories/apikeys.repository";
import { DeviceRepository } from "@/repositories/device.repository";
import { APIKeyDocument } from "@/types/apikey";
import { hashKey } from "@/utils/apikey";
import { randomBytes } from "crypto";

export class DeviceService{
    private deviceRepository: DeviceRepository;
    private apiKeyRepository: APIKeysRepository;
    constructor(){
        this.deviceRepository = new DeviceRepository();
        this.apiKeyRepository = new APIKeysRepository();
    }

    public async createDeviceAPIKey(deviceId: string, userId: string): Promise<{ rawKey: string, apiKey: APIKeyDocument }>{
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
}

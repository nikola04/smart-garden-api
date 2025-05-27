import APIKey from "@/models/apikey.model";
import { APIKeyDocument } from "@/types/apikey";

export class APIKeysRepository {
    private static instance: APIKeysRepository;
    constructor() {
        if (APIKeysRepository.instance) {
            return APIKeysRepository.instance;
        }
        APIKeysRepository.instance = this;
    }

    public async findValidByDeviceId(deviceId: string): Promise<APIKeyDocument[]>{
        await APIKey.deleteMany({ device: deviceId, expiresAt: { $ne: null, $lt: new Date() } });
        const keys = await APIKey.find({ device: deviceId });
        return keys;
    }

    public async findValidByKey(key: string, { populateDevice = false }: { populateDevice?: boolean }): Promise<APIKeyDocument|null>{
        const apiKey = await APIKey.findOne({ key }).populate(populateDevice ? "device" : "");
        if(apiKey === null || apiKey.expiresAt === null || apiKey.expiresAt >= new Date())
            return apiKey;
        await APIKey.deleteOne({ _id: apiKey.id });
        return null;
    }

    public async createAPIKey(deviceId: string, key: string, expiresAt?: Date): Promise<APIKeyDocument|null> {
        try{
            const apiKey = await APIKey.create({ device: deviceId, key, expiresAt });
            return apiKey;
        }catch(err){
            if(err instanceof Error && err.message.includes("duplicate key"))
                throw new Error("device has key");
            return null;
        }
    }

    public async deleteAPIKey(deviceId: string, keyId: string): Promise<boolean> {
        const deleted = await APIKey.deleteOne({ device: deviceId, _id: keyId });
        return deleted.deletedCount > 0;
    }

    public async deleteDeviceAPIKeys(deviceId: string): Promise<boolean> {
        const deleted = await APIKey.deleteMany({ device: deviceId });
        return deleted.deletedCount > 0;
    }
}

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
    public async findValidByKey(key: string): Promise<APIKeyDocument|null>{
        const apiKey = await APIKey.findOne({ key });
        if(apiKey === null || apiKey.expiresAt === null || apiKey.expiresAt >= new Date())
            return apiKey;
        await APIKey.deleteOne({ _id: apiKey.id });
        return null;
    }
    public async createAPIKey(deviceId: string, key: string, expiresAt?: Date): Promise<APIKeyDocument|null> {
        const apiKey = await APIKey.create({ device: deviceId, key, expiresAt });
        return apiKey;
    }
}

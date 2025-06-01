import { IAPIKeyDTO } from "@/dtos/apikey.dto";
import { IAPIKey } from "@/types/apikey";

export const formatIAPIKey= (apikey: IAPIKey): IAPIKeyDTO => {
    const key = "*".repeat(apikey.key.length);
    return ({
        id: apikey.id,
        key,
        expiresAt: apikey.expiresAt,
        createdAt: apikey.createdAt
    });
};

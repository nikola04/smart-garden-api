export interface IAPIKeyDTO {
    id: string;
    key: string;
    expiresAt: Date | null;
    createdAt: Date;
}

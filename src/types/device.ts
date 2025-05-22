export enum DeviceType {
    ESP32 = "ESP32"
}

export interface IDevice {
    name?: string;
    deviceType: DeviceType;
    addedAt: Date;
}

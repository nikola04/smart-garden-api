import { IAir, IBattery, ILight, ISensorReport, ISoil, ISolarPanel } from "@/types/sensors";
import { isNumber, isBoolean, isObject } from "./validator";

const isAirData = (obj: unknown): obj is IAir => {
    return (
        isObject(obj) &&
        isNumber(obj.temperature) &&
        isNumber(obj.humidity)
    );
};


const isLightData = (obj: unknown): obj is ILight => {
    return (
        isObject(obj) &&
        isNumber(obj.value) &&
        isBoolean(obj.night)
    );
};

const isSoilData = (obj: unknown): obj is ISoil => {
    return (
        isObject(obj) &&
        isNumber(obj.moisture) &&
        isNumber(obj.sensors_used)
    );
};

const isBatteryData = (obj: unknown): obj is IBattery => {
    return (
        isObject(obj) &&
        isNumber(obj.level) &&
        isNumber(obj.voltage)
    );
};

const isSolarPanelData = (obj: unknown): obj is ISolarPanel => {
    return (
        isObject(obj) &&
        isNumber(obj.voltage) &&
        isNumber(obj.current) &&
        isBoolean(obj.charging)
    );
};

export const isSensorReport = (obj: unknown): obj is ISensorReport => {
    return (
        isObject(obj) &&
        isAirData(obj.air) &&
        isSoilData(obj.soil) &&
        isLightData(obj.light) &&
        isBatteryData(obj.battery) &&
        isSolarPanelData(obj.solar_panel)
    );
};

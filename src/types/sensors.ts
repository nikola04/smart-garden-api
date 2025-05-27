export interface IAir{
    temperature: number;
    humidity: number;
}

export interface ILight{
    value: number;
    night: boolean;
}

export interface ISoil{
    moisture: number; // float
    sensors_used: number;
}

export interface IBattery{
    level: number;
    voltage: number;
}

export interface ICharger{
    voltage: number;
    current: number;
    charging: boolean;
}

export interface ISensorReport{
    air: IAir;
    soil: ISoil;
    light: ILight;
    battery: IBattery;
    charger: ICharger;
}

import responseHelper from "@/helpers/response.helper";
import { ISensorReport } from "@/types/sensors";
// import { DeviceService } from "@/services/device.service";
import { Request, Response } from "express";

// const deviceService = new DeviceService();

export const reportController = async (req: Request, res: Response): Promise<void> => {
    try{
        const { air, soil, light, battery, solar_panel } = req.body as ISensorReport;
        console.log("Air: ", air);
        console.log("Soil: ", soil);
        console.log("Light: ", light);
        console.log("Battery: ", battery);
        console.log("SolarPanel: ", solar_panel);
        responseHelper.success({ res, message: "OK" });
    }catch(_err){
        responseHelper.error({ res, code: 500, message: "Internal server error." });
    }
};

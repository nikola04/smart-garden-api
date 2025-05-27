import responseHelper from "@/helpers/response.helper";
import { DeviceRequest } from "@/middlewares/verifykey";
import { ReportService } from "@/services/report.service";
import { ISensorReport } from "@/types/sensors";
import { Response } from "express";

const reportService = new ReportService();

export const reportController = async (req: DeviceRequest, res: Response): Promise<void> => {
    try{
        if(!req.device || typeof req.device !== "object")
            return responseHelper.error({ res, code: 401, message: "Unauthorized." });

        const sensorData = req.body as ISensorReport;
        await reportService.saveReport(req.device.id, req.device.project.toString(), sensorData);

        responseHelper.success({ res, message: "OK" });
    }catch(err){
        if(err instanceof Error){
            if(err.message === "report not created")
                return responseHelper.error({ res, code: 500, message: "Error saving report." });
            if(err.message.startsWith("report too soon"))
                return responseHelper.error({ res, code: 429, message: "Please wait before sending another report.", retry: parseInt(err.message.split("#")[1]) });
        }
        responseHelper.error({ res, code: 500, message: "Internal server error." });
    }
};

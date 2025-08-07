import { logger } from "@/configs/logger.config";
import responseHelper from "@/helpers/response.helper";
import { AuthRequest } from "@/middlewares/authenticate";
import { ReportService } from "@/services/report.service";
import { Response } from "express";

const reportService = new ReportService();

export const getAirDataController = async (req: AuthRequest, res: Response): Promise<void> => {
    try{
        if(!req.user)
            return responseHelper.error({ res, code: 401, message: "Unauthorized." });

        const projectId = req.params.projectId;

        const airData = await reportService.getLastAirReports(projectId, { last: 30 });

        return responseHelper.success({ res, code: 200, message: "Found air data successfully.", data: { airData } });
    }catch(err){
        logger.error(`[getAirDataController] ${err}`);
        responseHelper.error({ res, code: 500, message: "Internal server error." });
    }
};

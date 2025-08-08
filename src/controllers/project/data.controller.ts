import { logger } from "@/configs/logger.config";
import responseHelper from "@/helpers/response.helper";
import { AuthRequest } from "@/middlewares/authenticate";
import { ReportService } from "@/services/report.service";
import { Response } from "express";

const reportService = new ReportService();

export const getAggregatedSnapshotController = async (req: AuthRequest, res: Response): Promise<void> => {
    try{
        if(!req.user)
            return responseHelper.error({ res, code: 401, message: "Unauthorized." });

        const userId = req.user.id;
        const projectId = req.params.projectId;

        const aggregatedSnapshot = await reportService.getAggregatedSensorSnapshot(userId, projectId);

        return responseHelper.success({ res, code: 200, message: "Found latest data successfully.", data: { aggregatedSnapshot } });
    }catch(err){
        if(err instanceof Error){
            if(err.message === "project doesn't exist")
                return responseHelper.error({ res, code: 404, message: "Projects doesn't exist."});
        }
        logger.error(`[getAggregatedSnapshotController] ${err}`);
        responseHelper.error({ res, code: 500, message: "Internal server error." });
    }
};

import { logger } from "@/configs/logger.config";
import responseHelper from "@/helpers/response.helper";
import { AuthRequest } from "@/middlewares/authenticate";
import { ProjectService } from "@/services/project.service";
import { Response } from "express";

const projectService = new ProjectService();

export const getProjectHealthController = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if(!req.user)
            return responseHelper.error({ res, code: 401, message: "Unauthorized." });

        const userId = req.user.id;
        const projectId = req.params.id;
        const health = await projectService.getProjectHeatlh(userId, projectId);

        responseHelper.success({ res, message: "Project health retrieved.", data: { health } });
    } catch (err) {
        logger.error(`[getProjectHealthController] ${err}`);
        responseHelper.error({ res, code: 500, message: "Internal server error." });
    }
};

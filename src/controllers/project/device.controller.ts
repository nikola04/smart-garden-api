import { logger } from "@/configs/logger.config";
import responseHelper from "@/helpers/response.helper";
import { AuthRequest } from "@/middlewares/authenticate";
import { ProjectService } from "@/services/project.service";
import { Response } from "express";

const projectService = new ProjectService();

export const getProjectDevicesController = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if(!req.user)
            return responseHelper.error({ res, code: 401, message: "Unauthorized." });

        const userId = req.user.id;
        const projects = await projectService.getProjectDevices(userId, req.params.id);

        const formated = projects.map((device) => ({
            id: device.id,
            name: device.name,
            type: device.type,
            addedAt: device.addedAt,
        }));

        responseHelper.success({ res, message: "Project devices retrieved successfully.", data: { devices: formated } });
    } catch (err) {
        logger.error(`[getProjectDevicesController] ${err}`);
        responseHelper.error({ res, code: 500, message: "Internal server error." });
    }
};

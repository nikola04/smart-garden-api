import { logger } from "@/configs/logger.config";
import { formatIDevice } from "@/formatters/device.formatter";
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
        const devices = await projectService.getProjectDevices(userId, req.params.id);

        const formated = devices.map(formatIDevice);

        responseHelper.success({ res, message: "Project devices retrieved successfully.", data: { devices: formated } });
    } catch (err) {
        logger.error(`[getProjectDevicesController] ${err}`);
        responseHelper.error({ res, code: 500, message: "Internal server error." });
    }
};

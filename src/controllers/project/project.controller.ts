import { logger } from "@/configs/logger.config";
import { formatIProject } from "@/formatters/project.formatter";
import responseHelper from "@/helpers/response.helper";
import { AuthRequest } from "@/middlewares/authenticate";
import { ProjectService } from "@/services/project.service";
import { Response } from "express";

const projectService = new ProjectService();

export const createProjectController = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if(!req.user)
            return responseHelper.error({ res, code: 401, message: "Unauthorized." });
        if(!req.user || !req.body || !req.body.name)
            return responseHelper.error({ res, code: 400, message: "Bad request." });

        const userId = req.user.id;
        const { name, description } = req.body;

        const project = await projectService.createProject(userId, name, description);
        const formated = formatIProject(project);

        responseHelper.success({ res, message: "Project created successfully.", data: { project: formated } });
    } catch (err) {
        if(err instanceof Error){
            if(err.message === "projects limit reached")
                return responseHelper.error({ res, code: 403, message: "Projects limit reached."});
            if(err.message === "name already used")
                return responseHelper.error({ res, code: 409, message: "Project name is already used."});
        }
        logger.error(`[createProjectController] ${err}`);
        responseHelper.error({ res, code: 500, message: "Internal server error." });
    }
};

export const deleteProjectController = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if(!req.user)
            return responseHelper.error({ res, code: 401, message: "Unauthorized." });

        const userId = req.user.id;
        const projectId = req.params.id;

        await projectService.deleteProject(userId, projectId);

        responseHelper.success({ res, message: "Project deleted successfully." });
    } catch (err) {
        if(err instanceof Error){
            if(err.message === "project not found")
                return responseHelper.error({ res, code: 404, message: "Project not found." });
        }
        logger.error(`[deleteProjectController] ${err}`);
        responseHelper.error({ res, code: 500, message: "Internal server error." });
    }
};


export const getProjectsController = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if(!req.user)
            return responseHelper.error({ res, code: 401, message: "Unauthorized." });

        const userId = req.user.id;
        const projects = await projectService.getProjects(userId);

        const formated = projects.map(formatIProject);

        responseHelper.success({ res, message: "Projects retrieved successfully.", data: { projects: formated } });
    } catch (err) {
        logger.error(`[getProjectsController] ${err}`);
        responseHelper.error({ res, code: 500, message: "Internal server error." });
    }
};


export const getProjectController = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if(!req.user)
            return responseHelper.error({ res, code: 401, message: "Unauthorized." });

        const userId = req.user.id;
        const projectId = req.params.id;

        const project = await projectService.getProject(userId, projectId);

        const formated = formatIProject(project);

        responseHelper.success({ res, message: "Projects retrieved successfully.", data: { project: formated } });
    } catch (err) {
        logger.error(`[getProjectsController] ${err}`);
        responseHelper.error({ res, code: 500, message: "Internal server error." });
    }
};

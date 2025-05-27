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
        const formated = ({ id: project.id, name: project.name, description: project.description, createdAt: project.createdAt, updatedAt: project.updatedAt });

        responseHelper.success({ res, message: "Project created successfully.", data: { project: formated } });
    } catch (err) {
        console.error("Error creating project:", err);
        responseHelper.error({ res, code: 500, message: "Internal server error." });
    }
};

export const getProjectsController = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if(!req.user)
            return responseHelper.error({ res, code: 401, message: "Unauthorized." });

        const userId = req.user.id;
        const projects = await projectService.getProjects(userId);

        const formated = projects.map((project) => ({
            id: project.id,
            name: project.name,
            description: project.description,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt
        }));

        responseHelper.success({ res, message: "Projects retrieved successfully.", data: { projects: formated } });
    } catch (err) {
        console.error("Error retrieving projects:", err);
        responseHelper.error({ res, code: 500, message: "Internal server error." });
    }
};

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

        responseHelper.success({ res, message: "Projects retrieved successfully.", data: { devices: formated } });
    } catch (err) {
        console.error("Error retrieving projects:", err);
        responseHelper.error({ res, code: 500, message: "Internal server error." });
    }
};

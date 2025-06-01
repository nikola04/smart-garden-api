import { IProjectDTO } from "@/dtos/project.dto";
import { IProject } from "@/types/project";

export const formatIProject = (project: IProject): IProjectDTO => {
    return ({
        id: project.id,
        name: project.name,
        description: project.description,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
    });
};

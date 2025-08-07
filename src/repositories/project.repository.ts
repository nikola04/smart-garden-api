import Project from "@/models/project.model";
import { IProject } from "@/types/project";

export class ProjectRepository {
    private static instance: ProjectRepository;
    constructor() {
        if (ProjectRepository.instance) {
            return ProjectRepository.instance;
        }
        ProjectRepository.instance = this;
    }
    public async getUserProjectById(userId: string, projectId: string): Promise<IProject|null> {
        const project = await Project.findOne({ user: userId, _id: projectId });
        return project;
    }
    public async getUserProjects(userId: string): Promise<IProject[]> {
        const projects = await Project.find({ user: userId });
        return projects;
    }
    public async deleteProject(userId: string, projectId: string): Promise<boolean> {
        const deleted = await Project.deleteOne({ _id: projectId, user: userId });
        return deleted.deletedCount > 0;
    }
    public async createProject(userId: string, name: string, description?: string): Promise<IProject> {
        const project = await Project.create({
            name,
            description,
            user: userId,
        });
        return project;
    }
}

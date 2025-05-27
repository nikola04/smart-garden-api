import Project from "@/models/project.model";
import { ProjectDocument } from "@/types/project";

export class ProjectRepository {
    private static instance: ProjectRepository;
    constructor() {
        if (ProjectRepository.instance) {
            return ProjectRepository.instance;
        }
        ProjectRepository.instance = this;
    }
    public async getProjectById(projectId: string): Promise<ProjectDocument|null> {
        const project = await Project.findById(projectId);
        return project;
    }
    public async getUserProjects(userId: string): Promise<ProjectDocument[]> {
        const projects = await Project.find({ user: userId });
        return projects;
    }
    public async createProject(userId: string, name: string, description?: string): Promise<ProjectDocument> {
        const project = await Project.create({
            name,
            description,
            user: userId,
        });
        return project;
    }
}

import { DeviceRepository } from "@/repositories/device.repository";
import { ProjectRepository } from "@/repositories/project.repository";
import { DeviceDocument } from "@/types/device";
import { ProjectDocument } from "@/types/project";

export class ProjectService{
    private projectRepository: ProjectRepository;
    private deviceRepository: DeviceRepository;
    constructor(){
        this.projectRepository = new ProjectRepository();
        this.deviceRepository = new DeviceRepository();
    }
    public async createProject(userId: string, name: string, description?: string): Promise<ProjectDocument> {
        const project = await this.projectRepository.createProject(userId, name, description);
        if(!project)
            throw new Error("project not created");
        return project;
    }

    public async getProjects(userId: string): Promise<ProjectDocument[]> {
        const projects = await this.projectRepository.getUserProjects(userId);
        if(!projects)
            throw new Error("projects not found");
        return projects;
    }

    public async getProjectDevices(userId: string, projectId: string): Promise<DeviceDocument[]> {
        const devices = await this.deviceRepository.getProjectDevices(userId, projectId);
        return devices;
    }
}

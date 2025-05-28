import appConfig from "@/configs/app.config";
import { DeviceRepository } from "@/repositories/device.repository";
import { ProjectRepository } from "@/repositories/project.repository";
import { DeviceDocument } from "@/types/device";
import { ProjectDocument } from "@/types/project";
import { DeviceService } from "./device.service";

export class ProjectService{
    private projectRepository: ProjectRepository;
    private deviceRepository: DeviceRepository;
    constructor(){
        this.projectRepository = new ProjectRepository();
        this.deviceRepository = new DeviceRepository();
    }
    public async createProject(userId: string, name: string, description?: string): Promise<ProjectDocument> {
        const desc = description && typeof description === "string" && description.trim().length > 0 ? description.trim() : undefined;
        const projects = await this.getProjects(userId);

        if(projects.length >= appConfig.maxUserProjects)
            throw new Error("projects limit reached");
        const nameLowerCase = name.toLowerCase().trim();
        if(projects.find((project) => project.name.toLowerCase() === nameLowerCase))
            throw new Error("name already used");

        const project = await this.projectRepository.createProject(userId, name, desc);
        if(!project)
            throw new Error("project not created");
        return project;
    }

    public async deleteProject(userId: string, projectId: string): Promise<void>{
        const deleted = await this.projectRepository.deleteProject(userId, projectId);
        if(!deleted)
            throw new Error("project not found");

        const devices = await this.deviceRepository.getProjectDevices(userId, projectId);
        const deviceService = new DeviceService();
        await Promise.all(devices.map((device) => {
            return deviceService.deleteDevice(device.id, userId);
        })).catch(console.error); // log to console if device is not deleted
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

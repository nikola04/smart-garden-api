import appConfig from "@/configs/app.config";
import { DeviceRepository } from "@/repositories/device.repository";
import { ProjectRepository } from "@/repositories/project.repository";
import { IDevice } from "@/types/device";
import { HealthStatus, IHealth, IProject } from "@/types/project";
import { DeviceService } from "./device.service";
import { logger } from "@/configs/logger.config";
import { ReportRepository } from "@/repositories/reports.repository";

export class ProjectService{
    private projectRepository: ProjectRepository;
    private deviceRepository: DeviceRepository;
    private reportRepository: ReportRepository;
    constructor(){
        this.projectRepository = new ProjectRepository();
        this.deviceRepository = new DeviceRepository();
        this.reportRepository = new ReportRepository();
    }
    public async createProject(userId: string, name: string, description?: string): Promise<IProject> {
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
        })).catch(logger.error); // log if device is not deleted
    }

    public async getProjects(userId: string): Promise<IProject[]> {
        const projects = await this.projectRepository.getUserProjects(userId);
        if(!projects)
            throw new Error("projects not found");
        return projects;
    }

    public async getProject(userId: string, projectId: string): Promise<IProject> {
        const project = await this.projectRepository.getUserProjectById(userId, projectId);
        if(!project)
            throw new Error("project not found");
        return project;
    }

    public async getProjectDevices(userId: string, projectId: string): Promise<IDevice[]> {
        const devices = await this.deviceRepository.getProjectDevices(userId, projectId);
        const activeDevices = await this.reportRepository.getActiveDevices(projectId);
        return devices.map(device => {
            const deviceActivity = activeDevices.find(d => d.id == device.id);
            return ({ ...device,
                isActive: deviceActivity != null ? true : false,
                lastActive: deviceActivity?.lastActive
            })
        });
    }

    public async getProjectHeatlh(userId: string, projectId: string): Promise<IHealth> {
        const [devices, activeDevices] = await Promise.all([
            this.deviceRepository.getProjectDevices(userId, projectId),
            this.reportRepository.getActiveDevices(projectId)
        ]);
        const activeDevicesIds = activeDevices.map(d => d.id);

        const deviceMessages: { name: string, state: string }[] = [];
        let inactiveDevices = 0;
        devices.forEach((device) => {
            if(activeDevicesIds.includes(device.id)) return;
            deviceMessages.push({ name: device.name ?? device.id, state: 'offline' });
            inactiveDevices++;
        });

        const deviceHealth = Math.floor(((devices.length - inactiveDevices) / devices.length) * 100);

        const overallHealth = deviceHealth;
        const status = getHealthStatus(overallHealth);

        return ({
            devices: {
                health: deviceHealth,
                messages: deviceMessages
            },
            sensors: {
                health: 0,
                messages: []
            },
            overallHealth,
            status
        });
    }
}

const getHealthStatus = (health: number): HealthStatus => {
    if(health == 100) return "excellent";
    if(health > 90) return "healthy";
    if(health > 40) return "degraded";
    return "critical"
}

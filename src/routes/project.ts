import { createDevicesController } from "@/controllers/device/device.controller";
import { getProjectDevicesController } from "@/controllers/project/device.controller";
import { createProjectController, deleteProjectController, getProjectsController } from "@/controllers/project/project.controller";
import { validateDeviceRequestBody } from "@/validators/device.validator";
import { validateProjectRequestBody, validateProjectRequest } from "@/validators/project.validator";
import { Router } from "express";

const router = Router();

router.get("/", getProjectsController);
router.post("/", validateProjectRequestBody, createProjectController);

router.delete("/:id", validateProjectRequest, deleteProjectController);

router.get("/:id/device/", validateProjectRequest, getProjectDevicesController);
router.post("/:id/device", validateProjectRequest, validateDeviceRequestBody, createDevicesController);

export default router;

import { createDevicesController } from "@/controllers/device/device.controller";
import { getProjectDevicesController } from "@/controllers/project/device.controller";
import { createProjectController, deleteProjectController, getProjectController, getProjectsController } from "@/controllers/project/project.controller";
import { validateDeviceRequestBody } from "@/validators/device.validator";
import { validateProjectRequestBody, validateProjectRequest } from "@/validators/project.validator";
import { Router } from "express";
import dataRouter from "./data";
import { getProjectHealthController } from "@/controllers/project/health.controller";

const router = Router();

router.use("/:projectId/data", dataRouter);

router.get("/", getProjectsController);
router.get("/:id", validateProjectRequest, getProjectController);
router.post("/", validateProjectRequestBody, createProjectController);

router.delete("/:id", validateProjectRequest, deleteProjectController);

router.get("/:id/health/", validateProjectRequest, getProjectHealthController);

router.get("/:id/device/", validateProjectRequest, getProjectDevicesController);
router.post("/:id/device", validateProjectRequest, validateDeviceRequestBody, createDevicesController);

export default router;

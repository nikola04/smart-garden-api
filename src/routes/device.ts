import { getDevicesController } from "@/controllers/device/device.controller";
import { createKeyController, getKeysController } from "@/controllers/device/key.controller";
import { validateKeysRequest } from "@/validators/key.validator";
import { Router } from "express";

const router = Router();

router.get("/", getDevicesController);
router.get("/:id/key", validateKeysRequest, getKeysController);
router.post("/:id/key", validateKeysRequest, createKeyController);

export default router;

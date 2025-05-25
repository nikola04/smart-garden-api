import { getDevicesController, updateDeviceController } from "@/controllers/device/device.controller";
import { createKeyController, deleteKeyController, getKeysController } from "@/controllers/device/key.controller";
import { validateDeviceRequest } from "@/validators/device.validator";
import { Router } from "express";

const router = Router();

router.get("/", getDevicesController);
router.patch("/:id", validateDeviceRequest, updateDeviceController);

router.get("/:id/key", validateDeviceRequest, getKeysController);
router.post("/:id/key", validateDeviceRequest, createKeyController);
router.delete("/:id/key/:keyId", validateDeviceRequest, deleteKeyController);

export default router;

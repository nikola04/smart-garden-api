import { keyController } from "@/controllers/device/key.controller";
import { Router } from "express";

const router = Router();

router.post("/:id/key", keyController);

export default router;

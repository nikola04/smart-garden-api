import { reportController } from "@/controllers/device/report.controller";
import { Router } from "express";

const router = Router();

router.post("/", reportController);

export default router;

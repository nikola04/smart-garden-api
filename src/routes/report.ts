import { reportController } from "@/controllers/device/report.controller";
import { validateReportRequest } from "@/validators/report.validator";
import { Router } from "express";

const router = Router();

router.post("/", validateReportRequest, reportController);

export default router;

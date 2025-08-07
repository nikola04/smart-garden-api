import { getAirDataController } from "@/controllers/project/data.controller";
import { Router } from "express";

const router = Router({ mergeParams: true });

router.get("/air", getAirDataController);

export default router;

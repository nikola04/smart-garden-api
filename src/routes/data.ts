import { getAggregatedSnapshotController } from "@/controllers/project/data.controller";
import { Router } from "express";

const router = Router({ mergeParams: true });

router.get("/snapshot", getAggregatedSnapshotController);

export default router;

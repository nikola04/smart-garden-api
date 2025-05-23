import { userMeController } from "@/controllers/user/me.controller";
import { Router } from "express";

const router = Router();

router.get("/@me", userMeController);

export default router;

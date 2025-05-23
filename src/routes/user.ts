import { userMeController } from "@/controllers/user/me.controller";
import { authenticate } from "@/middlewares/authenticate";
import { Router } from "express";

const router = Router();

router.get("/@me", authenticate, userMeController);

export default router;

import { loginController } from "@/controllers/auth/login.controller";
import { refreshController } from "@/controllers/auth/refresh.controller";
import { Router } from "express";

const router = Router();

router.post("/login", loginController);
router.post("/refresh", refreshController);

export default router;

import { loginController } from "@/controllers/auth/login.controller";
import { Router } from "express";

const router = Router();

router.post("/login", loginController);

export default router;

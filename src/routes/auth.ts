import { googleCallbackController, googleLoginController } from "@/controllers/auth/google.controller";
import { loginController } from "@/controllers/auth/login.controller";
import { refreshController } from "@/controllers/auth/refresh.controller";
import { registerController } from "@/controllers/auth/register.controller";
import { validateLoginRequest, validateRegisterRequest } from "@/validators/auth.validator";
import { Router } from "express";

const router = Router();

router.post("/register", validateRegisterRequest, registerController);
router.post("/login", validateLoginRequest, loginController);
router.post("/refresh", refreshController);

router.get("/google/callback", googleCallbackController);
router.get("/google/login", googleLoginController);

export default router;

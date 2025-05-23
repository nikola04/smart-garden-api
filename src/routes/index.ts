import { Router } from "express";
import deviceRouter from "./device";
import authRouter from "./auth";
import userRoute from "./user";
import reportRoute from "./report";
import { authenticate } from "@/middlewares/authenticate";
import { verifyKey } from "@/middlewares/verifykey";

const router = Router();

router.use("/auth", authRouter);
router.use("/device", authenticate, deviceRouter);
router.use("/user", authenticate, userRoute);
router.use("/report", verifyKey, reportRoute);

router.get("/", (req, res) => {
    res.send("SmartGarden API Server");
});


export default router;

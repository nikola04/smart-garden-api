import { Router } from "express";
import reportRouter from "./report";
import authRouter from "./auth";
import userRoute from "./user";

const router = Router();

router.use("/auth", authRouter);
router.use("/report", reportRouter);
router.use("/user", userRoute);

router.get("/", (req, res) => {
    res.send("SmartGarden API Server");
});


export default router;

import { Router } from "express";
import reportRouter from "./report";
const router = Router();

router.use("/report", reportRouter);

router.get("/", (req, res) => {
    res.send("SmartGarden API Server");
});


export default router;

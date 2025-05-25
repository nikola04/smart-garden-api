import responseHelper from "@/helpers/response.helper";
import { NextFunction, Request, Response } from "express";
import { isSensorReport } from "./sensors.validator";

export const validateReportRequest = (req: Request, res: Response, next: NextFunction): void => {
    if(!req.body)
        return responseHelper.error({ res, code: 400, message: "Body not provided." });

    if(!isSensorReport(req.body))
        return responseHelper.error({ res, code: 400, message: "Invalid sensor data." });
    next();
};

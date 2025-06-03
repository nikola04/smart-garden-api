import responseHelper from "@/helpers/response.helper";
import { NextFunction, Request, Response } from "express";

export const validateRegisterRequest = (req: Request, res: Response, next: NextFunction): void => {
    if(!req.body)
        return responseHelper.error({ res, code: 400, message: "Invalid request body." });

    if(!req.body.name || !isValidName(req.body.name))
        return responseHelper.error({ res, code: 400, message: "Invalid name." });

    if(!req.body.email || !isValidEmail(req.body.email.trim()))
        return responseHelper.error({ res, code: 400, message: "Invalid email." });

    if(!req.body.password || !isValidPassword(req.body.password))
        return responseHelper.error({ res,
            code: 400,
            message: "Invalid password. Password should be a combination of at least 8 letters (a-z, A-Z), numbers, or special characters."
        });

    req.body.password = req.body.password.trim();
    next();
};

export const validateLoginRequest = (req: Request, res: Response, next: NextFunction): void => {
    if(!req.body)
        return responseHelper.error({ res, code: 400, message: "Invalid request body." });

    if(!req.body.email || !isValidEmail(req.body.email.trim()))
        return responseHelper.error({ res, code: 400, message: "Invalid email." });

    if(!req.body.password || typeof req.body.password !== "string" || req.body.password.trim() === "")
        return responseHelper.error({ res, code: 400, message: "Invalid password." });

    req.body.email = req.body.email.trim();
    req.body.password = req.body.password.trim();
    next();
};


export const isValidName = (name: string): boolean => {
    const nameRegex = /^[\p{L} ]{2,50}$/u;
    return nameRegex.test(name);
};

export const isValidEmail = (email: string): boolean => {
    const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;
    return emailRegex.test(email);
};

export const isValidPassword = (pswd: string): boolean => {
    const passwordRegex = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]{8,}$/;
    return passwordRegex.test(pswd);
};

import { Response } from "express";

export interface IResponse{
    res: Response,
    code?: number,
    message: string,
    data?: null|unknown
}

/**
 * Success response helper
 * @function success
 * @description Sends a standardized success response to the client.
 * It sets the HTTP status code and returns a JSON response with `success: true`,
 * the provided `message`, and optionally some `data`.
 *
 * @param {IResponse} params - An object containing the response object, status code, message, and optional data.
 * @param {import('express').Response} params.res - Express response object.
 * @param {number} params.code - HTTP status code to send. Default is 200.
 * @param {string} params.message - Success message to include in the response.
 * @param {any} [params.data] - Optional data to include in the response.
 *
 * @returns {void}
 *
 * @example
 * success({ res, code: 200, message: "User created", data: user });
 */
const success = ({ res, code = 200, message, data }: IResponse): void => {
    res.status(code).json({
        success: true,
        message,
        data
    });
    return;
};

/**
 * Error response helper
 * @function error
 * @description Sends a standardized error response to the client.
 * It sets the HTTP status code and returns a JSON response with `success: false`,
 * the provided error `message`, and optionally some additional `data`.
 *
 * @param {IResponse} params - An object containing the response object, status code, message, and optional data.
 * @param {import('express').Response} params.res - Express response object.
 * @param {number} params.code - HTTP status code to send. Default is 500.
 * @param {string} params.message - Error message to include in the response.
 *
 * @returns {void}
 *
 * @example
 * error({ res, code: 400, message: "Invalid request"});
 */
const error = ({ res, code = 500, message }: IResponse): void => {
    res.status(code).json({
        success: false,
        message
    });
    return;
};

export const cookie = ({ res, name, value, maxAge, path = "/" }: {
    res: Response,
    name: string,
    value: string,
    maxAge: number,
    path?: string
}): void => {
    res.cookie(name, value, {
        maxAge,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        domain: process.env.NODE_ENV === "production" ? `.${process.env.DOMAIN}` : undefined,
        path,
    });
};


export default ({
    success,
    error,
    cookie
});

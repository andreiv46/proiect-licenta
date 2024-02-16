import { NextFunction, Request, Response } from "express";
import logger from "./logger";

export class CustomError extends Error {
    statusCode: number;
    constructor(message?: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    next: NextFunction
): Response | void {
    if (res.headersSent) {
        return next(err);
    }

    if (err instanceof Error) {
        logger.error(err.message, { stack: err.stack });
    }

    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({ message: err.message });
    }

    return res.status(500).json({ message: "Internal server error" });
}

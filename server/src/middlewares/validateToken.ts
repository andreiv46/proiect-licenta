import "dotenv/config";
import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { ExtendedRequest } from "../utils/types";
import { UserWithoutPassword } from "../models/user.model";
import {
    AuthorizationHeaderRequiredError,
    InvalidTokenError,
    TokenRequiredError,
} from "../errors/auth.errors";
import logger from "../utils/logger";

export const verifyToken = (
    req: ExtendedRequest,
    _res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        throw new AuthorizationHeaderRequiredError();
    }

    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        throw new TokenRequiredError();
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY!, (error, payload) => {
        if (error) {
            logger.error(error);
            throw new InvalidTokenError();
        }
        const userPayload = payload as UserWithoutPassword;
        const user = {
            id: userPayload.id,
            email: userPayload.email,
            username: userPayload.username,
        };
        req.user = user;
        next();
    });
};

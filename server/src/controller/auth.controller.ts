import { NextFunction, Request, Response } from "express";
import {
    registerUser,
    findUserByEmailOrUsername,
    authenticateUser,
    generateToken,
} from "../service/user.service";
import { UserAlreadyExistsError } from "../errors/auth.errors";
import { RegisterInput, LoginInput } from "../schema/user.schema";
import { ExtendedRequest } from "../utils/types";

export async function register(
    req: Request<{}, {}, RegisterInput["body"]>,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        const { email, username } = req.body;

        const existingUser = await findUserByEmailOrUsername(email, username);

        if (existingUser) {
            throw new UserAlreadyExistsError();
        }

        const user = await registerUser(req.body);
        return res.status(201).json(user);
    } catch (error: unknown) {
        next(error);
    }
}

export async function login(
    req: Request<{}, {}, LoginInput["body"]>,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        const { email, password } = req.body;
        const user = await authenticateUser(email, password);

        const payload = {
            id: user.id,
            email: user.email,
            username: user.username,
        };

        const token = generateToken(payload);

        return res.status(200).json({ user, token });
    } catch (error: unknown) {
        next(error);
    }
}

export async function getCurrentUser(
    req: ExtendedRequest,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        return res.status(200).json(req.user);
    } catch (error: unknown) {
        next(error);
    }
}

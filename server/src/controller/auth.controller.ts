import { NextFunction, Request, Response } from "express";
import {
    registerUser,
    findUserByEmailOrUsername,
    authenticateUser,
} from "../service/user.service";
import { UserAlreadyExistsError } from "../errors/auth.errors";
import { RegisterInput, LoginInput } from "../schema/user.schema";
import jwt from "jsonwebtoken";

export async function register(
    req: Request<{}, {}, RegisterInput["body"]>,
    res: Response,
    next: NextFunction
) {
    try {
        const { email, username } = req.body;

        const existingUser = await findUserByEmailOrUsername(email, username);

        if (existingUser) {
            throw new UserAlreadyExistsError();
        }

        const user = await registerUser(req.body);
        return res.status(201).json(user);
    } catch (error: unknown) {
        return next(error);
    }
}

export async function login(
    req: Request<{}, {}, LoginInput["body"]>,
    res: Response,
    next: NextFunction
) {
    try {
        const { email, password } = req.body;
        const user = await authenticateUser(email, password);

        const token = jwt.sign({ user }, process.env.JWT_SECRET_KEY!, {
            expiresIn: "1h",
        });

        return res.status(200).json({ user, token });
    } catch (error: unknown) {
        return next(error);
    }
}

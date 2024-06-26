import UserModel from "../models/user.model";
import { UserWithoutPassword, UserInput } from "../models/user.model";
import { UserNotFoundError, InvalidPasswordError } from "../errors/auth.errors";
import jwt from "jsonwebtoken";
import "dotenv/config";

export async function registerUser(
    input: UserInput
): Promise<UserWithoutPassword> {
    const user = await UserModel.create(input);
    return user.sanitize();
}

export async function findUserByEmailOrUsername(
    email: string,
    username: string
): Promise<UserWithoutPassword | null> {
    const existingUser = await UserModel.findOne({
        $or: [{ email }, { username }],
    });
    return existingUser?.sanitize() ?? null;
}

export async function authenticateUser(
    email: string,
    password: string
): Promise<UserWithoutPassword> {
    const user = await UserModel.findOne({ email });
    if (!user) {
        throw new UserNotFoundError();
    }
    const passwordIsValid = await user.comparePassword(password);
    if (!passwordIsValid) {
        throw new InvalidPasswordError();
    }
    return user.sanitize();
}

export async function findUserById(id: string): Promise<UserWithoutPassword> {
    const user = await UserModel.findById(id);
    UserModel.watch();
    if (!user) {
        throw new UserNotFoundError();
    }
    return user.sanitize();
}

export function generateToken(payload: object): string {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY!, {
        expiresIn: "7d", // for testing purposes
    });
}


import { object, string, TypeOf } from "zod";

export const registerSchema = object({
    body: object({
        username: string({
            required_error: "Username is required",
        }).min(3, "Username too short - should be at least 3 characters long"),
        email: string({
            required_error: "Email is required",
        }).email("Not a valid email"),
        password: string({
            required_error: "Password is required",
        }).min(5, "Password too short - should be at least 5 characters long"),
    }).strict(),
});

export const loginSchema = object({
    body: object({
        email: string({
            required_error: "Email is required",
        }).email("Not a valid email"),
        password: string({
            required_error: "Password is required",
        }).min(5, "Password too short - should be at least 5 characters long"),
    }).strict(),
});

export type RegisterInput = TypeOf<typeof registerSchema>;
export type LoginInput = TypeOf<typeof loginSchema>;

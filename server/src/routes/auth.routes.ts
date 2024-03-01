import { register, login, getCurrentUser } from "../controller/auth.controller";
import { Router } from "express";
import { validate } from "../middlewares/validateResource";
import { loginSchema, registerSchema } from "../schema/user.schema";
import { verifyToken } from "../middlewares/validateToken";

const router = Router();

router
    .post("/register", validate(registerSchema), register)
    .post("/login", validate(loginSchema), login)
    .get("/current", verifyToken, getCurrentUser);

export default router;

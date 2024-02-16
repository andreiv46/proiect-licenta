import { register, login } from "../controller/auth.controller";
import { Router } from "express";
import validate from "../middlewares/validateResource";
import { loginSchema, registerSchema } from "../schema/user.schema";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

export default router;

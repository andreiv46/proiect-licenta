import { Router } from "express";
import { createExpenseCategoryHandler } from "../controller/expense-category.controller";
import { validate } from "../middlewares/validateResource";
import { createExpenseCategorySchema } from "../schema/expense-category.schema";

const router = Router();

router.post(
    "/",
    validate(createExpenseCategorySchema),
    createExpenseCategoryHandler
);

export default router;

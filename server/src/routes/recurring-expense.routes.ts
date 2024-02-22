import { Router } from "express";
import { validate } from "../middlewares/validateResource";
import { createRecurringExpenseSchema } from "../schema/recurring-expense.schema";
import {
    createRecurringExpenseHandler,
    getRecurringExpensesHandler,
    getRecurringExpenseHandler,
    deleteRecurringExpenseHandler,
} from "../controller/recurring-expense.controller";

const router = Router();

router
    .post(
        "/",
        validate(createRecurringExpenseSchema),
        createRecurringExpenseHandler
    )
    .get("/", getRecurringExpensesHandler)
    .get("/:id", getRecurringExpenseHandler)
    .delete("/:id", deleteRecurringExpenseHandler);

export default router;

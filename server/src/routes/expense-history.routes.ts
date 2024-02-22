import { Router } from "express";
import {
    createExpenseHistoryHandler,
    getExpenseHistoriesHandler,
    getExpenseHistoryHandler,
    deleteExpenseHistoryHandler,
} from "../controller/expense-history.controller";
import { validate } from "../middlewares/validateResource";
import { expenseHistorySchema } from "../schema/expense-history.schema";

const router = Router();

router
    .post("/", validate(expenseHistorySchema), createExpenseHistoryHandler)
    .get("/", getExpenseHistoriesHandler)
    .get("/:id", getExpenseHistoryHandler)
    .delete("/:id", deleteExpenseHistoryHandler);

export default router;

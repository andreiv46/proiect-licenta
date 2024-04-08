import { Router } from "express";
import { validate } from "../middlewares/validateResource";
import { createSharedExpenseSchema } from "../schema/shared-expense.schema";
import {
    createSharedExpenseHandler,
    getSharedExpenseInvitesHandler,
    getSharedExpensesHandler,
} from "../controller/shared-expense.controller";

const router = Router();

router
    .post("/", validate(createSharedExpenseSchema), createSharedExpenseHandler)
    .get("/", getSharedExpensesHandler)
    .get("/invites", getSharedExpenseInvitesHandler);

export default router;

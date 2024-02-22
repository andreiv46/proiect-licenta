import { Response, NextFunction } from "express";
import { ExtendedRequest } from "../utils/types";
import { createExpenseCategory } from "../service/expense-category.service";
import { CreateExpenseCategoryInput } from "../schema/expense-category.schema";

export async function createExpenseCategoryHandler(
    req: ExtendedRequest<{}, {}, CreateExpenseCategoryInput["body"]>,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        const expenseCategory = await createExpenseCategory(req.body);
        return res
            .status(201)
            .json({ message: "Expense category created", expenseCategory });
    } catch (error: unknown) {
        next(error);
    }
}

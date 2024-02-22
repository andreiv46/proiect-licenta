import { Response, NextFunction } from "express";
import { ExtendedRequest } from "../utils/types";
import { CreateRecurringExpenseInput } from "../schema/recurring-expense.schema";
import {
    createRecurringExpense,
    getRecurringExpenseById,
    getRecurringExpenses,
    deleteRecurringExpenseById,
} from "../service/recurring-expense.service";

export async function createRecurringExpenseHandler(
    req: ExtendedRequest<{}, {}, CreateRecurringExpenseInput["body"]>,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        const userId = req.user?.id!;
        const recurringExpense = await createRecurringExpense(req.body, userId);
        return res.status(201).json(recurringExpense);
    } catch (error) {
        return next(error);
    }
}

export async function getRecurringExpensesHandler(
    req: ExtendedRequest,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        const userId = req.user?.id!;
        const recurringExpenses = await getRecurringExpenses(userId);
        return res.status(200).json(recurringExpenses);
    } catch (error) {
        return next(error);
    }
}

export async function getRecurringExpenseHandler(
    req: ExtendedRequest<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        const userId = req.user?.id!;
        const id = req.params.id;
        const recurringExpense = await getRecurringExpenseById(id, userId);
        return res.status(200).json(recurringExpense);
    } catch (error) {
        return next(error);
    }
}

export async function deleteRecurringExpenseHandler(
    req: ExtendedRequest<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        const userId = req.user?.id!;
        const id = req.params.id;
        await deleteRecurringExpenseById(id, userId);
        return res.status(204).json({ message: "Recurring expense deleted" });
    } catch (error) {
        return next(error);
    }
}

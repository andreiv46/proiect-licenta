import { Response, NextFunction } from "express";
import { ExtendedRequest } from "../utils/types";
import { ExpenseHistoryInput } from "../schema/expense-history.schema";
import {
    createExpenseHistory,
    getExpenseHistories,
    getExpenseHistoryById,
    deleteExpenseHistoryById,
} from "../service/expense-history.service";

export async function createExpenseHistoryHandler(
    req: ExtendedRequest<{}, {}, ExpenseHistoryInput["body"]>,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        const userId = req.user?.id!;
        const expenseHistory = await createExpenseHistory(req.body, userId);
        return res.status(201).json(expenseHistory);
    } catch (error: unknown) {
        next(error);
    }
}

export async function getExpenseHistoriesHandler(
    req: ExtendedRequest,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        const userId = req.user?.id!;
        const expenseHistories = await getExpenseHistories(userId);
        return res.status(200).json(expenseHistories);
    } catch (error: unknown) {
        next(error);
    }
}

export async function getExpenseHistoryHandler(
    req: ExtendedRequest<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        const userId = req.user?.id!;
        const id = req.params.id;
        const expenseHistory = await getExpenseHistoryById(id, userId);
        return res.status(200).json(expenseHistory);
    } catch (error: unknown) {
        next(error);
    }
}

export async function deleteExpenseHistoryHandler(
    req: ExtendedRequest<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        const userId = req.user?.id!;
        const id = req.params.id;
        await deleteExpenseHistoryById(id, userId);
        return res.status(204).json({ message: "Expense history deleted" });
    } catch (error: unknown) {
        next(error);
    }
}

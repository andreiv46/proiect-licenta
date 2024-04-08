import { Response, NextFunction } from "express";
import { ExtendedRequest } from "../utils/types";
import { CreateSharedExpenseInput } from "../schema/shared-expense.schema";
import {
    createSharedExpense,
    createSharedExpenseInvitations,
    getSharedExpenseInvites,
    getSharedExpenses,
    createUsershareExpense,
} from "../service/shared-expense.service";

export async function createSharedExpenseHandler(
    req: ExtendedRequest<{}, {}, CreateSharedExpenseInput["body"]>,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        const userId = req.user?.id!;
        const sharedExpense = await createSharedExpense(req.body, userId);
        await createUsershareExpense(userId, sharedExpense);
        await createSharedExpenseInvitations(
            userId,
            sharedExpense,
            req.body.friends
        );
        return res.status(201).json(sharedExpense);
    } catch (error) {
        return next(error);
    }
}

export async function getSharedExpenseInvitesHandler(
    req: ExtendedRequest,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        const invites = await getSharedExpenseInvites(req.user?.id!);
        return res.status(200).json(invites);
    } catch (error) {
        return next(error);
    }
}

export async function getSharedExpensesHandler(
    req: ExtendedRequest,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        const sharedExpenses = await getSharedExpenses(req.user?.id!);
        return res.status(200).json(sharedExpenses);
    } catch (error) {
        return next(error);
    }
}
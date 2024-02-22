import ExpenseHistoryModel from "../models/expense-history.model";
import { ExpenseHistoryInput } from "../schema/expense-history.schema";
import { ExpenseHistoryWithoutUser } from "../models/expense-history.model";
import {
    ExpenseHistoryIsEmptyError,
    ExpenseHistoryNotFoundError,
} from "../errors/expense-history.errors";

export async function createExpenseHistory(
    input: ExpenseHistoryInput["body"],
    userId: string
): Promise<ExpenseHistoryWithoutUser> {
    const expenseHistory = await ExpenseHistoryModel.create({
        ...input,
        user: userId,
    });
    return expenseHistory.sanitize();
}

export async function getExpenseHistories(
    userId: string
): Promise<ExpenseHistoryWithoutUser[]> {
    const expenseHistories = await ExpenseHistoryModel.find({
        user: userId,
    });
    if (!expenseHistories) {
        throw new ExpenseHistoryIsEmptyError();
    }
    return expenseHistories.map((history) => history.sanitize());
}

export async function getExpenseHistoryById(
    id: string,
    userId: string
): Promise<ExpenseHistoryWithoutUser> {
    const expenseHistory = await ExpenseHistoryModel.findOne({
        _id: id,
        user: userId,
    });
    if (!expenseHistory) {
        throw new ExpenseHistoryNotFoundError();
    }
    return expenseHistory.sanitize();
}

export async function deleteExpenseHistoryById(
    id: string,
    userId: string
): Promise<void> {
    const expenseHistory = await ExpenseHistoryModel.findOneAndDelete({
        _id: id,
        user: userId,
    });
    if (!expenseHistory) {
        throw new ExpenseHistoryNotFoundError();
    }
}

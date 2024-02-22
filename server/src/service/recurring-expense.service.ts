import { CreateRecurringExpenseInput } from "../schema/recurring-expense.schema";
import RecurringExpenseModel, {
    RecurringDocument,
} from "../models/recurring-expense.model";
import ExpenseCategoryModel from "../models/expense-category.model";
import { ExpenseCategoryNotFoundError } from "../errors/expense-category.errors";
import { RecurringExpenseNotFoundError } from "../errors/recurring-expense.errors";

export async function createRecurringExpense(
    input: CreateRecurringExpenseInput["body"],
    userId: string
): Promise<RecurringDocument> {
    const category = await ExpenseCategoryModel.findById(input.category);
    if (!category) {
        throw new ExpenseCategoryNotFoundError();
    }
    const recurringExpense = await RecurringExpenseModel.create({
        ...input,
        user: userId,
        nextPaymentDate: input.startDate,
    });
    return recurringExpense;
}

export async function getRecurringExpenses(
    userId: string
): Promise<RecurringDocument[]> {
    const recurringExpenses = await RecurringExpenseModel.find({
        user: userId,
    });
    if (!recurringExpenses) {
        throw new RecurringExpenseNotFoundError();
    }
    return recurringExpenses;
}

export async function getRecurringExpenseById(
    id: string,
    userId: string
): Promise<RecurringDocument> {
    const recurringExpense = await RecurringExpenseModel.findOne({
        _id: id,
        user: userId,
    });
    if (!recurringExpense) {
        throw new RecurringExpenseNotFoundError();
    }
    return recurringExpense;
}

export async function deleteRecurringExpenseById(
    id: string,
    userId: string
): Promise<void> {
    const recurringExpense = await RecurringExpenseModel.findOneAndDelete({
        _id: id,
        user: userId,
    });
    if (!recurringExpense) {
        throw new RecurringExpenseNotFoundError();
    }
}

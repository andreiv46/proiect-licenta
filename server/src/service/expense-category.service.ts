import { CreateExpenseCategoryInput } from "../schema/expense-category.schema";
import ExpenseCategoryModel, {
    ExpenseCategoryDocument,
} from "../models/expense-category.model";

export async function createExpenseCategory(
    input: CreateExpenseCategoryInput["body"]
): Promise<ExpenseCategoryDocument> {
    const expenseCategory = await ExpenseCategoryModel.create(input);
    return expenseCategory;
}

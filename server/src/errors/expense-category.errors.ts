import { CustomError } from "../utils/errors";

export class ExpenseCategoryNotFoundError extends CustomError {
    constructor() {
        super("Expense category not found", 404);
    }
}

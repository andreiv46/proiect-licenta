import { CustomError } from "../utils/errors";

export class ExpenseHistoryNotFoundError extends CustomError {
    constructor() {
        super("Expense history not found", 404);
    }
}

export class ExpenseHistoryIsEmptyError extends CustomError {
    constructor() {
        super("Expense history is empty", 404);
    }
}

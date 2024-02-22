import { CustomError } from "../utils/errors";

export class RecurringExpenseNotFoundError extends CustomError {
    constructor() {
        super("Recurring expense not found", 404);
    }
}

export class RecurringExpenseValidationError extends CustomError {
    constructor() {
        super("Recurring expense validation failed", 400);
    }
}

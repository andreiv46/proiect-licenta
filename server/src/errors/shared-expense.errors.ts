import { CustomError } from "../utils/errors";

export class SharedExpenseNotFoundError extends CustomError {
    constructor() {
        super("Shared expense not found", 404);
    }
}

export class SharedExpenseNotCreatedError extends CustomError {
    constructor() {
        super("Shared expense could not be created", 500);
    }
}

export class SharedExpensesInvitesNotFoundError extends CustomError {
    constructor() {
        super("Shared expense invites not found", 404);
    }
}

export class SharedExpensesNotFoundError extends CustomError {
    constructor() {
        super("Shared expenses not found", 404);
    }
}

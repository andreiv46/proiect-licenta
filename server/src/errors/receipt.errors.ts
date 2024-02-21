import { CustomError } from "../utils/errors";

export class ReceiptAnalysisError extends CustomError {
    constructor() {
        super("Receipt analysis failed.", 500);
    }
}

export class TotalRequiredError extends CustomError {
    constructor() {
        super("Total is required for unanalyzed receipts.", 400);
    }
}

export class NoReceiptsError extends CustomError {
    constructor() {
        super("No receipts found.", 404);
    }
}

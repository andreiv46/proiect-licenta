import { CustomError } from "../utils/errors";

export class FileTooLargeError extends CustomError {
    constructor() {
        super("File too large", 400);
    }
}

export class FileFormatNotSupportedError extends CustomError {
    constructor() {
        super("File format not supported", 400);
    }
}

export class NoFileUploadedError extends CustomError {
    constructor() {
        super("No file uploaded", 400);
    }
}

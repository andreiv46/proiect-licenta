import { CustomError } from "../utils/errors";

export class UserNotFoundError extends CustomError {
    constructor(message = "User not found") {
        super(message, 404);
    }
}

export class UserAlreadyExistsError extends CustomError {
    constructor(message = "User already exists") {
        super(message, 409);
    }
}

export class InvalidPasswordError extends CustomError {
    constructor(message = "Invalid password") {
        super(message, 400);
    }
}

export class AuthorizationHeaderRequiredError extends CustomError {
    constructor(message = "Authorization header is required") {
        super(message, 401);
    }
}

export class InvalidTokenError extends CustomError {
    constructor(message = "Invalid token") {
        super(message, 403);
    }
}

export class TokenRequiredError extends CustomError {
    constructor(message = "Token is required") {
        super(message, 401);
    }
}

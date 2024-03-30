import { CustomError } from "../utils/errors";

export class SelfFriendshipError extends CustomError {
    constructor(message = "You cannot add yourself as a friend") {
        super(message, 400);
    }
}

export class FriendRequestCreationError extends CustomError {
    constructor(message = "Failed to create friend request") {
        super(message, 500);
    }
}

export class FriendRequestAlreadyExistsError extends CustomError {
    constructor(message = "Friend request already exists") {
        super(message, 400);
    }
}

export class FriendRequestNotFound extends CustomError {
    constructor(message = "Friend request not found") {
        super(message, 404);
    }
}

export class FriendAlreadyExistsError extends CustomError {
    constructor(message = "Friend already exists") {
        super(message, 400);
    }
}
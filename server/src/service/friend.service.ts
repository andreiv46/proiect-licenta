import { UserWithoutPassword } from "../models/user.model";
import UserModel from "../models/user.model";
import { UserNotFoundError } from "../errors/auth.errors";
import FriendRequestModel, {
    FriendRequestDocument,
} from "../models/friend-request.model";
import {
    FriendRequestCreationError,
    FriendRequestAlreadyExistsError,
    FriendRequestNotFound,
    FriendAlreadyExistsError,
} from "../errors/friend.errors";

export async function findFriendByUsername(
    username: string
): Promise<UserWithoutPassword | null> {
    const user = await UserModel.findOne({
        username,
    });

    if (!user) {
        throw new UserNotFoundError();
    }

    return user.sanitize();
}

export async function createFriendRequest(
    senderId: string,
    recipientUserName: string
): Promise<void> {
    const recipientUser = await UserModel.findOne({
        username: recipientUserName,
    });
    if (!recipientUser) {
        throw new UserNotFoundError();
    }

    const sender = await UserModel.findById(senderId);
    if (sender?.friends.includes(recipientUser.id)) {
        throw new FriendAlreadyExistsError();
    }

    const existingFriendRequest = await FriendRequestModel.findOne({
        sender: senderId,
        recipient: recipientUser.id,
        status: "pending",
    });
    if (existingFriendRequest) {
        throw new FriendRequestAlreadyExistsError();
    }

    const friendRequest = await FriendRequestModel.create({
        sender: senderId,
        recipient: recipientUser.id,
    });
    if (!friendRequest) {
        throw new FriendRequestCreationError();
    }
}

export async function getFriendRequests(
    userId: string
): Promise<FriendRequestDocument[]> {
    const friendRequests = await FriendRequestModel.find({
        recipient: userId,
        status: "pending",
    }).populate("sender", ["username", "email", "_id"]);

    if (!friendRequests) {
        throw new FriendRequestNotFound();
    }

    return friendRequests;
}

export async function acceptFriendRequest(
    userId: string,
    requestId: string
): Promise<void> {
    const friendRequest = await FriendRequestModel.findById(requestId).populate(
        "sender",
        ["username", "email", "_id"]
    );
    if (!friendRequest) {
        throw new FriendRequestNotFound();
    }

    if (friendRequest.recipient.toString() !== userId) {
        console.log("recipient", userId);
        console.log("request recipient", friendRequest.recipient);
        throw new FriendRequestNotFound();
    }

    const sender = await UserModel.findById(friendRequest.sender.id);
    const recipient = await UserModel.findById(userId);

    if (!recipient || !sender) {
        throw new UserNotFoundError();
    }

    recipient.friends.push(sender.id);
    sender.friends.push(recipient.id);

    await recipient.save();
    await sender.save();
    await FriendRequestModel.findByIdAndUpdate(requestId, {
        status: "accepted",
    });
}

export async function rejectFriendRequest(
    userId: string,
    requestId: string
): Promise<void> {
    const friendRequest = await FriendRequestModel.findById(requestId).populate(
        "sender",
        ["username", "email", "_id"]
    );
    if (!friendRequest) {
        throw new FriendRequestNotFound();
    }

    if (friendRequest.recipient.toString() !== userId) {
        throw new FriendRequestNotFound();
    }

    await FriendRequestModel.findByIdAndUpdate(requestId, {
        status: "rejected",
    });
}

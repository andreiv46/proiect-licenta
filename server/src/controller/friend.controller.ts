import { Response, NextFunction } from "express";
import { ExtendedRequest } from "../utils/types";
import {
    findFriendByUsername,
    createFriendRequest,
    getFriendRequests,
    acceptFriendRequest,
    rejectFriendRequest,
} from "../service/friend.service";
import { SelfFriendshipError } from "../errors/friend.errors";

export async function findFriendHandler(
    req: ExtendedRequest<{}, {}, {}, { username: string }>,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        const { username } = req.query;
        if (req.user?.username === username) {
            throw new SelfFriendshipError();
        }
        const user = await findFriendByUsername(username);
        return res.status(200).json(user);
    } catch (error) {
        return next(error);
    }
}

export async function getFriendRequestsHandler(
    req: ExtendedRequest,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        const friendRequests = await getFriendRequests(req.user?.id!);
        return res.status(200).json(friendRequests);
    } catch (error) {
        return next(error);
    }
}

export async function addFriendHandler(
    req: ExtendedRequest<{}, {}, {}, { username: string }>,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        const { username } = req.query;
        if (req.user?.username === username) {
            throw new SelfFriendshipError();
        }
        await createFriendRequest(req.user?.id!, username);
        return res.status(200).json({ message: "Friend request sent" });
    } catch (error) {
        return next(error);
    }
}

export async function acceptFriendRequestHandler(
    req: ExtendedRequest<{ requestId: string }>,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        const { requestId } = req.params;
        await acceptFriendRequest(req.user?.id!, requestId);
        return res.status(200).json({ message: "Friend request accepted" });
    } catch (error) {
        return next(error);
    }
}

export async function rejectFriendRequestHandler(
    req: ExtendedRequest<{ requestId: string }>,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        const { requestId } = req.params;
        await rejectFriendRequest(req.user?.id!, requestId);
        return res.status(200).json({ message: "Friend request rejected" });
    } catch (error) {
        return next(error);
    }
}

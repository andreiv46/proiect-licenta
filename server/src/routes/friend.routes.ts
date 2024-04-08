import { Router } from "express";
import {
    findFriendHandler,
    addFriendHandler,
    getFriendRequestsHandler,
    acceptFriendRequestHandler,
    rejectFriendRequestHandler,
    getFriendsHandler,
} from "../controller/friend.controller";

const router = Router();

router
    .get("/", getFriendsHandler)
    .get("/requests", getFriendRequestsHandler)
    .get("/find", findFriendHandler)
    .post("/add", addFriendHandler)
    .patch("/requests/:requestId/accept", acceptFriendRequestHandler)
    .patch("/requests/:requestId/reject", rejectFriendRequestHandler);

export default router;

import { Router } from "express";
import {
    findFriendHandler,
    addFriendHandler,
    getFriendRequestsHandler,
    acceptFriendRequestHandler,
    rejectFriendRequestHandler,
} from "../controller/friend.controller";

const router = Router();

router
    .get("/requests", getFriendRequestsHandler)
    .get("/find", findFriendHandler)
    .post("/add", addFriendHandler)
    .patch("/requests/:requestId/accept", acceptFriendRequestHandler)
    .patch("/requests/:requestId/reject", rejectFriendRequestHandler);

export default router;

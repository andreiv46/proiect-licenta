import mongoose from "mongoose";
import { UserDocument } from "./user.model";

export interface FriendRequest {
    sender: UserDocument["_id"];
    recipient: UserDocument["_id"];
    status: "pending" | "accepted" | "rejected";
}

export interface FriendRequestDocument
    extends FriendRequest,
        mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
}

const friendRequestSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<FriendRequestDocument>(
    "FriendRequest",
    friendRequestSchema
);

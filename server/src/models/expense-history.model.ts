import mongoose from "mongoose";
import { UserDocument } from "./user.model";

export interface ExpenseHistory {
    description?: string;
    amount: number;
    date: Date;
    recipient?: string;
}

export type ExpenseHistoryWithoutUser = Omit<
    ExpenseHistoryDocument,
    "user" | "createdAt" | "updatedAt"
>;

export interface ExpenseHistoryDocument
    extends ExpenseHistory,
        mongoose.Document {
    user: UserDocument["_id"];
    createdAt: Date;
    updatedAt: Date;
    sanitize: () => ExpenseHistoryWithoutUser;
}

const expenseHistorySchema = new mongoose.Schema<ExpenseHistoryDocument>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        description: {
            type: String,
        },
        amount: {
            type: Number,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        recipient: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

expenseHistorySchema.methods.sanitize = function () {
    const expenseHistory = this.toObject();

    delete expenseHistory.user;
    delete expenseHistory.createdAt;
    delete expenseHistory.updatedAt;
    delete expenseHistory.__v;

    return expenseHistory;
};

export default mongoose.model<ExpenseHistoryDocument>(
    "ExpenseHistory",
    expenseHistorySchema
);

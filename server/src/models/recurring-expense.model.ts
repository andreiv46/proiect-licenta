import mongoose from "mongoose";
import { UserDocument } from "./user.model";
import { ExpenseCategoryDocument } from "./expense-category.model";
import { RecurringExpenseValidationError } from "../errors/recurring-expense.errors";

export enum Frequency {
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY",
    YEARLY = "YEARLY",
}

export interface RecurringExpenseInput {
    name: string;
    description?: string;
    amount: number;
    frequency: Frequency;
    startDate: Date;
    endDate?: Date;
    recipient?: string;
}

export interface RecurringDocument
    extends RecurringExpenseInput,
        mongoose.Document {
    user: UserDocument["_id"];
    nextPaymentDate: Date;
    category: ExpenseCategoryDocument["_id"];
    createdAt: Date;
    updatedAt: Date;
    calculateNextPaymentDate(): Date;
}

const recurringExpenseSchema = new mongoose.Schema<RecurringDocument>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ExpenseCategory",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        amount: {
            type: Number,
            required: true,
        },
        frequency: {
            type: String,
            enum: Object.values(Frequency),
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
        },
        nextPaymentDate: {
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

recurringExpenseSchema.pre<RecurringDocument>("save", function (next) {
    const nextPaymentDate = this.calculateNextPaymentDate();
    if (this.endDate) {
        const endDate = new Date(this.endDate.setHours(0, 0, 0, 0));
        const nextDate = new Date(nextPaymentDate.setHours(0, 0, 0, 0));
        if (nextDate > endDate) {
            throw new RecurringExpenseValidationError();
        }
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (nextPaymentDate < today) {
        throw new RecurringExpenseValidationError();
    }
    this.nextPaymentDate = nextPaymentDate;
    next();
});

recurringExpenseSchema.methods.calculateNextPaymentDate = function () {
    let nextPaymentDate: Date;
    if (this.isNew) {
        nextPaymentDate = new Date(this.startDate);
    } else {
        nextPaymentDate = new Date(this.nextPaymentDate);
    }

    switch (this.frequency) {
        case Frequency.DAILY:
            nextPaymentDate.setDate(nextPaymentDate.getDate() + 1);
            break;
        case Frequency.WEEKLY:
            nextPaymentDate.setDate(nextPaymentDate.getDate() + 7);
            break;
        case Frequency.MONTHLY:
            nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
            break;
        case Frequency.YEARLY:
            nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);
            break;
        default:
            throw new Error("Invalid frequency");
    }

    return nextPaymentDate;
};

export default mongoose.model<RecurringDocument>(
    "RecurringExpense",
    recurringExpenseSchema
);

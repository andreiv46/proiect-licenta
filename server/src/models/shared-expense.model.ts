import mongoose from "mongoose";
import { Frequency } from "./recurring-expense.model";
import { UserDocument } from "./user.model";
import { CustomError } from "../utils/errors";

// SharedExpense model
export interface SharedExpenseInput {
    owner: UserDocument["_id"];
    ownerAmount: number;
    totalAmount: number;
    name: string;
    paymentInfo?: string;
    description?: string;
    frequency: Frequency;
    startDate: Date;
    endDate?: Date;
    recipient?: string;
    friends: {
        user: UserDocument["_id"];
        amount: number;
        sharePaid: boolean;
    }[];
}

export interface SharedExpenseDocument
    extends SharedExpenseInput,
        mongoose.Document {
    nextPaymentDate: Date;
    createdAt: Date;
    updatedAt: Date;
    calculateNextPaymentDate(): Date;
}

const sharedExpenseSchema = new mongoose.Schema<SharedExpenseDocument>(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        ownerAmount: {
            type: Number,
            required: true,
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        paymentInfo: {
            type: String,
        },
        description: {
            type: String,
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
        recipient: {
            type: String,
        },
        friends: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                amount: {
                    type: Number,
                    required: true,
                },
                sharePaid: {
                    type: Boolean,
                    required: true,
                    default: false,
                },
            },
        ],
        nextPaymentDate: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

sharedExpenseSchema.pre<SharedExpenseDocument>("save", function (next) {
    const nextPaymentDate = this.calculateNextPaymentDate();
    if (this.endDate) {
        const endDate = new Date(this.endDate.setHours(0, 0, 0, 0));
        const nextDate = new Date(nextPaymentDate.setHours(0, 0, 0, 0));
        if (nextDate > endDate) {
            throw new CustomError(
                "End date must be after next payment date",
                400
            );
        }
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (nextPaymentDate < today) {
        throw new CustomError("Next payment date must be in the future", 400);
    }
    this.nextPaymentDate = nextPaymentDate;
    next();
});

sharedExpenseSchema.methods.calculateNextPaymentDate = function () {
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

export const SharedExpenseModel = mongoose.model<SharedExpenseDocument>(
    "SharedExpense",
    sharedExpenseSchema
);

// UserSharedExpense model

export interface UserSharedExpenseDocument extends mongoose.Document {
    user: UserDocument;
    sharedExpense: SharedExpenseDocument;
    isOwner: boolean;
    notify: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const userSharedExpenseSchema = new mongoose.Schema<UserSharedExpenseDocument>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        sharedExpense: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SharedExpense",
            required: true,
        },
        isOwner: {
            type: Boolean,
            required: true,
        },
        notify: {
            type: Boolean,
            required: true,
            default: true,
        },
    },
    { timestamps: true }
);

export const UserSharedExpenseModel = mongoose.model<UserSharedExpenseDocument>(
    "UserSharedExpense",
    userSharedExpenseSchema
);

// Shared Expense History model
export interface SharedExpenseHistory {
    owner: UserDocument["_id"];
    ownerAmount: number;
    totalAmount: number;
    name: string;
    paymentInfo?: string;
    description?: string;
    recipient?: string;
    friends: {
        user: UserDocument["_id"];
        amount: number;
        sharePaid: boolean;
    }[];
}

export interface SharedExpenseHistoryDocument
    extends SharedExpenseHistory,
        mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
}

const sharedExpenseHistorySchema =
    new mongoose.Schema<SharedExpenseHistoryDocument>(
        {
            owner: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            ownerAmount: {
                type: Number,
                required: true,
            },
            totalAmount: {
                type: Number,
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            paymentInfo: {
                type: String,
            },
            description: {
                type: String,
            },
            recipient: {
                type: String,
            },
            friends: [
                {
                    user: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User",
                        required: true,
                    },
                    amount: {
                        type: Number,
                        required: true,
                    },
                    sharePaid: {
                        type: Boolean,
                        required: true,
                        default: false,
                    },
                },
            ],
        },
        { timestamps: true }
    );

export const SharedExpenseHistoryModel =
    mongoose.model<SharedExpenseHistoryDocument>(
        "SharedExpenseHistory",
        sharedExpenseHistorySchema
    );

// Shared Expense Invitation model
export interface SharedExpenseInvitationInput {
    sharedExpense: SharedExpenseDocument["_id"];
    user: UserDocument["_id"];
    amount: number;
}

export interface SharedExpenseInvitationDocument
    extends SharedExpenseInvitationInput,
        mongoose.Document {
    status: "pending" | "accepted" | "rejected";
    invitedBy: UserDocument["_id"];
    createdAt: Date;
    updatedAt: Date;
}

const sharedExpenseInvitationSchema =
    new mongoose.Schema<SharedExpenseInvitationDocument>(
        {
            sharedExpense: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "SharedExpense",
                required: true,
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            invitedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            amount: {
                type: Number,
                required: true,
            },
            status: {
                type: String,
                enum: ["pending", "accepted", "rejected"],
                required: true,
                default: "pending",
            },
        },
        { timestamps: true }
    );

export const SharedExpenseInvitationModel =
    mongoose.model<SharedExpenseInvitationDocument>(
        "SharedExpenseInvitation",
        sharedExpenseInvitationSchema
    );

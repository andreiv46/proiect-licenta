import mongoose from "mongoose";
import { UserDocument } from "./user.model";

export interface ReceiptInput {
    name: string;
    analyzeReceipt: boolean;
    total?: number;
}

export interface Item {
    description: string;
    price: number;
    quantity?: number;
    totalPrice: number;
    quantityUnit?: string;
}

export interface Receipt {
    merchantName?: string;
    merchantPhoneNumber?: string;
    merchantAddress?: string;
    total: number;
    transactionDate?: string;
    transactionTime?: string;
    subtotal?: number;
    totalTax?: number;
    items?: Item[];
}

export interface SanitizedReceipt extends Receipt {
    analyzed: boolean;
}

export interface ReceiptDocument extends Receipt, mongoose.Document {
    user: UserDocument["_id"];
    analyzed: boolean;
    filePath: string;
    createdAt: Date;
    updatedAt: Date;
    sanitize(): SanitizedReceipt;
}

export const receiptSchema = new mongoose.Schema<ReceiptDocument, ReceiptModel>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        merchantName: {
            type: String,
        },
        merchantPhoneNumber: {
            type: String,
        },
        merchantAddress: {
            type: String,
        },
        total: {
            type: Number,
            required: true,
        },
        transactionDate: {
            type: String,
        },
        transactionTime: {
            type: String,
        },
        subtotal: {
            type: Number,
        },
        totalTax: {
            type: Number,
        },
        items: [
            {
                description: {
                    type: String,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                quantity: {
                    type: Number,
                },
                totalPrice: {
                    type: Number,
                    required: true,
                },
                quantityUnit: {
                    type: String,
                },
            },
        ],
        analyzed: {
            type: Boolean,
            required: true,
        },
        filePath: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

receiptSchema.statics.findByUserId = async function (
    userId: string
): Promise<ReceiptDocument[]> {
    return this.find({ user: userId });
};

receiptSchema.methods.sanitize = function (): SanitizedReceipt {
    const receipt = this.toObject();
    const { __v, user, filePath, createdAt, updatedAt, ...sanitized } = receipt;
    return sanitized;
};

export interface ReceiptModel extends mongoose.Model<ReceiptDocument> {
    findByUserId(userId: string): Promise<ReceiptDocument[]>;
}

export default mongoose.model<ReceiptDocument, ReceiptModel>(
    "Receipt",
    receiptSchema
);

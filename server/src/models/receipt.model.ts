import mongoose from "mongoose";
import { UserDocument } from "./user.model";
import { fileToBase64 } from "../utils/multer";

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

export interface ItemWithId extends Item {
    _id: string;
}

export interface Receipt {
    merchantName?: string;
    merchantPhoneNumber?: string;
    merchantAddress?: string;
    total: number;
    transactionDate?: Date;
    transactionTime?: string;
    subtotal?: number;
    totalTax?: number;
    items?: Item[];
}

export interface SanitizedReceipt extends Receipt {
    _id: string;
    analyzed: boolean;
    base64File?: string;
    items?: ItemWithId[];
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
            type: Date,
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
    userId: string,
    limit?: number,
    offset?: number
): Promise<{ receipts: ReceiptDocument[]; total: number }> {
    const total = await this.countDocuments({ user: userId });
    const receipts = await this.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(offset || 0)
        .limit(limit || 0);
    return { receipts, total };
};

receiptSchema.methods.sanitize = function (): SanitizedReceipt {
    const receipt = this.toObject();
    const { __v, user, filePath, createdAt, updatedAt, ...sanitized } = receipt;
    sanitized.base64File = fileToBase64(filePath);
    return sanitized;
};

export interface ReceiptModel extends mongoose.Model<ReceiptDocument> {
    findByUserId(
        userId: string,
        limit?: number,
        offset?: number
    ): Promise<{ receipts: ReceiptDocument[]; total: number }>;
}

export default mongoose.model<ReceiptDocument, ReceiptModel>(
    "Receipt",
    receiptSchema
);

import mongoose from "mongoose";
import { UserDocument } from "./user.model";

export interface ReceiptInput {
    name: string;
    analyzeReceipt: boolean;
    total?: number;
}

interface Item {
    description: string;
    price: number;
    quantity?: number;
    totalPrice: number;
    productCode?: string;
    quantityUnit?: string;
}

export interface ReceiptDocument extends mongoose.Document {
    user: UserDocument["_id"];
    merchantName?: string;
    merchantPhoneNumber?: string;
    merchantAddress?: string;
    total: number;
    transactionDate?: Date;
    transactionTime?: string;
    subtotal?: number;
    totalTax?: number;
    items?: Item[];
    analyzed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export const receiptSchema = new mongoose.Schema(
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
                productCode: {
                    type: String,
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
    },
    {
        timestamps: true,
    }
);

const ReceiptModel = mongoose.model<ReceiptDocument>("Receipt", receiptSchema);

export default ReceiptModel;

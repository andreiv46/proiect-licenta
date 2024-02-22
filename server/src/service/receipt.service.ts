import { getFormRecognizerClient } from "../utils/form-recognizer";
import * as fs from "fs";
import "dotenv/config";
import logger from "../utils/logger";
import { Item, Receipt, SanitizedReceipt } from "../models/receipt.model";
import ReceiptModel from "../models/receipt.model";
import {
    NoReceiptsError,
    ReceiptAnalysisError,
    TotalRequiredError,
} from "../errors/receipt.errors";

export async function createReceipt(
    filePath: string,
    analyzeReceipt: boolean,
    userId: string,
    total?: number
): Promise<SanitizedReceipt> {
    if (!analyzeReceipt && total === undefined) {
        throw new TotalRequiredError();
    }

    if (!analyzeReceipt) {
        const receipt = await ReceiptModel.create({
            filePath,
            analyzed: false,
            total: total!,
            user: userId,
        });
        return receipt.sanitize();
    }

    const analyzedReceipt = await analyzeReceiptForm(filePath);

    if (!analyzedReceipt) {
        throw new ReceiptAnalysisError();
    }

    const receipt = await ReceiptModel.create({
        filePath,
        analyzed: true,
        ...analyzedReceipt,
        user: userId,
    });
    return receipt.sanitize();
}

export async function getReceipts(userId: string): Promise<SanitizedReceipt[]> {
    const receipts = await ReceiptModel.findByUserId(userId);
    if (receipts.length === 0) {
        throw new NoReceiptsError();
    }
    return receipts.map((receipt) => receipt.sanitize());
}

export async function deleteReceiptById(
    receiptId: string,
    userId: string
): Promise<void> {
    const receipt = await ReceiptModel.findOneAndDelete({
        _id: receiptId,
        user: userId,
    }).exec();
    if (!receipt) {
        throw new NoReceiptsError();
    }
}

export async function getReceiptById(
    receiptId: string,
    userId: string
): Promise<SanitizedReceipt> {
    const receipt = await ReceiptModel.findOne({
        _id: receiptId,
        user: userId,
    }).exec();
    if (!receipt) {
        throw new NoReceiptsError();
    }
    return receipt.sanitize();
}

export async function analyzeReceiptForm(
    formPath: string
): Promise<Receipt | null> {
    const readStream = fs.createReadStream(formPath);
    const client = getFormRecognizerClient();
    const poller = await client.beginAnalyzeDocument(
        process.env.RECEIPT_MODEL_ID!,
        readStream,
        {
            onProgress: (state) => {
                logger.info(`Status: ${state.status}`);
            },
        }
    );
    const pollerResult = await poller.pollUntilDone();

    if (!pollerResult.documents) {
        throw new Error("No documents in the result.");
    }

    const {
        documents: [result],
    } = pollerResult;

    const receipt = result.fields;

    if (receipt === undefined) {
        throw new Error("Expected at least one receipt in analysis result.");
    }
    console.log("=== Receipt Information ===");
    console.log("Type:", result.docType);
    console.log("Confidence:", result.confidence);
    if (result.confidence < 0.8) {
        return null;
    }
    const receiptInfo: Partial<Receipt> = {};
    if (receipt.MerchantName?.content) {
        receiptInfo.merchantName = receipt.MerchantName.content;
        console.log("Merchant:", receipt.MerchantName?.content);
    }
    if (receipt.Total?.content) {
        receiptInfo.total = (receipt.Total as any).value;
        console.log("Total:", receipt.Total?.content);
    }
    if (receipt.Items) {
        receiptInfo.items = [];
        if (receipt.Items.kind === "array") {
            for (const item of receipt.Items.values) {
                if (item.kind === "object") {
                    const itemInfo: Item = {
                        description: "",
                        price: 0,
                        totalPrice: 0,
                    };
                    const {
                        Description,
                        TotalPrice,
                        Quantity,
                        Price,
                        QuantityUnit,
                    } = item.properties;

                    if (Description?.content) {
                        itemInfo.description = Description.content;
                        console.log("Description:", Description.content);
                    }
                    if (TotalPrice?.content) {
                        itemInfo.totalPrice = (TotalPrice as any).value;
                        console.log("Total Price:", TotalPrice.content);
                    }
                    if (Quantity?.content) {
                        itemInfo.quantity = (Quantity as any).value;
                        console.log("Quantity:", Quantity.content);
                    }
                    if (Price?.content) {
                        itemInfo.price = (Price as any).value;
                        console.log("Price:", Price.content);
                    }
                    if (QuantityUnit?.content) {
                        itemInfo.quantityUnit = QuantityUnit.content;
                        console.log("Quantity Unit:", QuantityUnit.content);
                    }
                    receiptInfo.items.push(itemInfo);
                }
            }
        }
    }
    if (receipt.TransactionDate?.content) {
        const transactionDate = new Date(
            (receipt.TransactionDate as any).value
        );
        receiptInfo.transactionDate = transactionDate;
        console.log("Transaction Date:", transactionDate);
    }
    if (receipt.TransactionTime?.content) {
        receiptInfo.transactionTime = receipt.TransactionTime.content;
        console.log("Transaction Time:", receipt.TransactionTime.content);
    }
    if (receipt.Subtotal?.content) {
        receiptInfo.subtotal = (receipt.Subtotal as any).value;
        console.log("Subtotal:", receipt.Subtotal.content);
    }
    if (receipt.TotalTax?.content) {
        receiptInfo.totalTax = (receipt.TotalTax as any).value;
        console.log("Total Tax:", receipt.TotalTax.content);
    }
    return receiptInfo as Receipt;
}

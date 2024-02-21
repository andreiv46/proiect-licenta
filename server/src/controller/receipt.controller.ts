import { Response, NextFunction } from "express";
import { ExtendedRequest } from "../utils/types";
import { CreateReceiptInput } from "../schema/receipt.schema";
import {
    createReceipt,
    getReceipts,
    deleteReceiptById,
    getReceiptById,
} from "../service/receipt.service";

export async function createReceiptHandler(
    req: ExtendedRequest<{}, {}, CreateReceiptInput["body"]>,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        const userId = req.user?.id!;
        const { analyzeReceipt, total } = req.body;
        const filePath = req.file?.path!;
        const receipt = await createReceipt(
            filePath,
            analyzeReceipt,
            userId,
            total
        );
        return res.status(201).json(receipt);
    } catch (error) {
        return next(error);
    }
}

export async function getReceiptsHandler(
    req: ExtendedRequest,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        const userId = req.user?.id!;
        const receipts = await getReceipts(userId);
        return res.status(200).json(receipts);
    } catch (error) {
        return next(error);
    }
}

export async function deleteReceiptHandler(
    req: ExtendedRequest<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        const userId = req.user?.id!;
        const receiptId = req.params.id;
        await deleteReceiptById(receiptId, userId);
        return res
            .status(204)
            .json({ message: "Receipt deleted successfully" });
    } catch (error) {
        return next(error);
    }
}

export async function getReceiptHandler(
    req: ExtendedRequest<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        const userId = req.user?.id!;
        const receiptId = req.params.id;
        const receipt = await getReceiptById(receiptId, userId);
        return res.status(200).json(receipt);
    } catch (error) {
        return next(error);
    }
}

import { Response, NextFunction } from "express";
import { ExtendedRequest } from "../utils/types";
import { CreateReceiptInput } from "../schema/receipt.schema";

export function createReceipt(
    req: ExtendedRequest<{}, {}, CreateReceiptInput["body"]>,
    res: Response,
    next: NextFunction
): Response | void {
    console.log(req.body); // ma ocup mai incolo dudududududu
    console.log(req.user);
    return res.status(201).json(req.body);
    next();
}

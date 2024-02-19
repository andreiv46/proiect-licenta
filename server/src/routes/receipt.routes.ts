import { Router } from "express";
import { uploadReceipt } from "../utils/multer";
import { createReceipt } from "../controller/receipt.controller";
import { validateFile } from "../middlewares/validateFile";
import { createReceiptSchema } from "../schema/receipt.schema";
import { validate } from "../middlewares/validateResource";
import "dotenv/config";

const router = Router();

router.post(
    "/test",
    uploadReceipt.single(process.env.RECEIPT_UPLOAD_FILE_KEY as string),
    validate(createReceiptSchema),
    validateFile,
    createReceipt
);

export default router;

import { Router } from "express";
import {
    createReceiptHandler,
    getReceiptsHandler,
    deleteReceiptHandler,
    getReceiptHandler,
} from "../controller/receipt.controller";
import { validateFile } from "../middlewares/validateFile";
import { createReceiptSchema } from "../schema/receipt.schema";
import { validate } from "../middlewares/validateResource";
import { uploadReceipt } from "../middlewares/fileUpload";

import "dotenv/config";

const router = Router();

router
    .post(
        "/",
        uploadReceipt,
        validateFile,
        validate(createReceiptSchema),
        createReceiptHandler
    )
    .get("/", getReceiptsHandler)
    .get("/:id", getReceiptHandler)
    .delete("/:id", deleteReceiptHandler);

export default router;

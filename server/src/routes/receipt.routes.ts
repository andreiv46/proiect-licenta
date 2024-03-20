import { Router } from "express";
import {
    createReceiptHandler,
    getReceiptsHandler,
    deleteReceiptHandler,
    getReceiptHandler,
} from "../controller/receipt.controller";
import { validateFile } from "../middlewares/validateFile";
import {
    createReceiptSchema,
    getReceiptsSchema,
} from "../schema/receipt.schema";
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
    .get("/", validate(getReceiptsSchema), getReceiptsHandler)
    .get("/:id", getReceiptHandler)
    .delete("/:id", deleteReceiptHandler);

export default router;

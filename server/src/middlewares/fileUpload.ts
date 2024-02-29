import { createStorage } from "../utils/multer";
import multer from "multer";
import {
    ALLOWED_FILE_TYPES,
    MAX_FILE_SIZE,
    ALOLWED_MIME_TYPES,
} from "../utils/constants";
import { FileFormatNotSupportedError } from "../errors/file-upload.errors";
import "dotenv/config";
import path from "path";

const receiptStorage = createStorage(process.env.RECEIPT_UPLOAD_FILE_KEY!);
export const uploadReceipt = multer({
    storage: receiptStorage,
    limits: {
        fileSize: MAX_FILE_SIZE,
    },
    fileFilter: function (_req, file, cb) {
        const fileTypes = ALLOWED_FILE_TYPES.test(
            path.extname(file.originalname).toLowerCase()
        );
        const mimeTypes = ALOLWED_MIME_TYPES.includes(file.mimetype);
        if (fileTypes && mimeTypes) {
            return cb(null, true);
        }
        cb(null, false);
        return cb(new FileFormatNotSupportedError());
    },
}).single(process.env.RECEIPT_UPLOAD_FILE_KEY!);
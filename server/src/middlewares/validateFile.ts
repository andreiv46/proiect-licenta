import { ExtendedRequest } from "../utils/types";
import { Response, NextFunction } from "express";
import { MAX_FILE_SIZE, SUPPORTED_FILE_FORMATS } from "../utils/constants";
import {
    FileFormatNotSupportedError,
    FileTooLargeError,
    NoFileUploadedError,
} from "../errors/file-upload.errors";

export function validateFile(
    req: ExtendedRequest,
    _res: Response,
    next: NextFunction
): Response | void {
    const file = req.file;
    if (!file) {
        throw new NoFileUploadedError();
    }
    if (file.size > MAX_FILE_SIZE) {
        throw new FileTooLargeError();
    }
    if (!SUPPORTED_FILE_FORMATS.includes(file.mimetype)) {
        throw new FileFormatNotSupportedError();
    }
    next();
}

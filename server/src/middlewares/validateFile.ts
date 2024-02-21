import { ExtendedRequest } from "../utils/types";
import { Response, NextFunction } from "express";
import { NoFileUploadedError } from "../errors/file-upload.errors";

export function validateFile(
    req: ExtendedRequest,
    _res: Response,
    next: NextFunction
): Response | void {
    if (!req.file) {
        throw new NoFileUploadedError();
    }
    next();
}

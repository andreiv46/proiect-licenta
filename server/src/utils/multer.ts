import multer from "multer";
import path from "path";
import fs from 'fs';

export const createStorage = (storageName: string) => {
    return multer.diskStorage({
        destination: function (_req, _file, cb) {
            cb(null, `./uploads/${storageName}`);
        },
        filename: function (_req, file, cb) {
            cb(
                null,
                `${storageName}-${Date.now()}${path.extname(file.originalname)}`
            );
        },
    });
};

export function fileToBase64(filePath: string): string {
    const file = fs.readFileSync(filePath);
    return file.toString('base64');
}
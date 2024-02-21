import multer from "multer";
import path from "path";

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

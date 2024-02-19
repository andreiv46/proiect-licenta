import multer from "multer";
import path from "path";

const createStorage = (storageName: string) => {
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

const receiptStorage = createStorage("receipt");
export const uploadReceipt = multer({ storage: receiptStorage });

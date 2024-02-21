import express from "express";
import logger from "./utils/logger";
import "dotenv/config";
import cors from "cors";
import connect from "./utils/mongodb-connection";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./utils/errors";
import receiptRoutes from "./routes/receipt.routes";
import { verifyToken } from "./middlewares/validateToken";
import { initializeFormRecognizerClient } from "./utils/form-recognizer";

const app = express();

app.use(express.json())
    .use(cors())
    .use("/auth", authRoutes)
    .use("/receipt", verifyToken, receiptRoutes)
    .use(errorHandler);

app.listen(process.env.PORT, async () => {
    logger.info(`Server is running on localhost:${process.env.PORT}`);
    await connect();
    await initializeFormRecognizerClient();
});

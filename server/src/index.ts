import express from "express";
import logger from "./utils/logger";
import "dotenv/config";
import cors from "cors";
import connect from "./utils/mongodb-connection";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./utils/errors";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);

app.use(errorHandler);

app.listen(process.env.PORT, async () => {
    logger.info(`Server is running on localhost:${process.env.PORT}`);
    await connect();
});

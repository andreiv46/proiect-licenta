import mongoose from "mongoose";
import "dotenv/config";
import vault from "./vault";
import logger from "./logger";

const connect = async () => {
    try {
        const connectionString = (
            await vault.getSecret(
                process.env.MONGODB_CONNECTION_STRING_SECRET_KEY!
            )
        ).value;

        if (!connectionString) {
            throw new Error("Connection string not found in the vault.");
        }

        await mongoose.connect(connectionString);
        logger.info("Connected to MongoDB");
    } catch (error: any) {
        logger.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
};

export default connect;

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
import expenseHistoryRoutes from "./routes/expense-history.routes";
import expenseCategoryRoutes from "./routes/expense-category.routes";
import recurringExpenseRoutes from "./routes/recurring-expense.routes";
import friendRoutes from "./routes/friend.routes";
import sharedExpenseRouter from "./routes/shared-expense.routes";

const app = express();

app.use(express.json())
    .use(cors())
    .use("/auth", authRoutes)
    .use("/receipt", verifyToken, receiptRoutes)
    .use("/expense-history", verifyToken, expenseHistoryRoutes)
    .use("/recurring-expense", verifyToken, recurringExpenseRoutes)
    .use("/expense-category", expenseCategoryRoutes)
    .use("/friend", verifyToken, friendRoutes)
    .use("/shared-expense", verifyToken, sharedExpenseRouter)
    .use(errorHandler);

app.listen(process.env.PORT, async () => {
    logger.info(`Server is running on localhost:${process.env.PORT}`);
    await connect();
    await initializeFormRecognizerClient();
});

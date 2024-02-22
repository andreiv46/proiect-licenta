import mongoose from "mongoose";

export interface ExpenseCategoryInput {
    name: string;
    description?: string;
}

export interface ExpenseCategory extends ExpenseCategoryInput {
    iconFilePath: string;
}

export interface ExpenseCategoryDocument
    extends ExpenseCategory,
        mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
}

const defaultIconFilePath: string = "public/icons/expenses.png";

const expenseCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
        },
        iconFilePath: {
            type: String,
            default: defaultIconFilePath,
        },
    },
    {
        timestamps: true,
    }
);

expenseCategorySchema.methods.findByName = async function (
    name: string
): Promise<ExpenseCategoryDocument | null> {
    return this.findOne({ name });
};

export default mongoose.model<ExpenseCategoryDocument>(
    "ExpenseCategory",
    expenseCategorySchema
);

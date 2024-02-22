import { object, string, number, TypeOf, coerce } from "zod";

export const expenseHistorySchema = object({
    body: object({
        description: string().min(1).optional(),
        amount: number({
            required_error: "Amount is required",
        })
            .positive("Amount must be positive")
            .finite("Amount must be finite"),
        date: coerce.date({
            required_error: "Date is required",
            invalid_type_error: "Date is invalid",
        }),
        recipient: string().min(2).optional(),
    }).strict(),
});

export type ExpenseHistoryInput = TypeOf<typeof expenseHistorySchema>;

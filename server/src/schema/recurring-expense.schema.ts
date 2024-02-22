import { object, string, number, coerce, TypeOf, nativeEnum } from "zod";
import { Frequency } from "../models/recurring-expense.model";

export const createRecurringExpenseSchema = object({
    body: object({
        name: string().min(1),
        description: string().min(1).optional(),
        amount: number({
            required_error: "Amount is required",
        })
            .positive("Amount must be positive")
            .finite("Amount must be finite"),
        frequency: nativeEnum(Frequency, {
            required_error: "Frequency is required",
        }),
        startDate: coerce.date({
            required_error: "Start date is required",
            invalid_type_error: "Start date is invalid",
        }),
        endDate: coerce.date().optional(),
        recipient: string().min(2).optional(),
        category: string({
            required_error: "Category is required",
        }),
    }).strict(),
});

export type CreateRecurringExpenseInput = TypeOf<
    typeof createRecurringExpenseSchema
>;

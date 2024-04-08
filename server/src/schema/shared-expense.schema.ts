import { object, string, number, coerce, TypeOf, nativeEnum } from "zod";
import { Frequency } from "../models/recurring-expense.model";

export const createSharedExpenseSchema = object({
    body: object({
        owner: string().min(1),
        ownerAmount: number({
            required_error: "Owner amount is required",
        })
            .positive("Owner amount must be positive")
            .finite("Owner amount must be finite"),
        totalAmount: number({
            required_error: "Total amount is required",
        })
            .positive("Total amount must be positive")
            .finite("Total amount must be finite"),
        name: string().min(1),
        paymentInfo: string().optional(),
        description: string().optional(),
        frequency: nativeEnum(Frequency, {
            required_error: "Frequency is required",
        }),
        startDate: coerce.date({
            required_error: "Start date is required",
            invalid_type_error: "Start date is invalid",
        }),
        endDate: coerce.date().optional(),
        recipient: string().optional(),
        friends: object({
            user: string().min(1),
            amount: number({
                required_error: "Friend amount is required",
            })
                .positive("Friend amount must be positive")
                .finite("Friend amount must be finite"),
            sharePaid: coerce.boolean({
                required_error: "Share paid is required",
                invalid_type_error: "Share paid is invalid",
            }),
        }).array(),
    }).strict(),
});

export type CreateSharedExpenseInput = TypeOf<typeof createSharedExpenseSchema>;

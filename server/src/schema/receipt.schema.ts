import { object, string, TypeOf } from "zod";

export const createReceiptSchema = object({
    body: object({
        name: string({
            required_error: "Name is required",
        }).min(1),
        analyzeReceipt: string({
            required_error: "Analyze receipt is required",
        })
            .min(1)
            .refine((val) => val === "true" || val === "false", {
                message: "Analyze receipt must be 'true' or 'false'",
            })
            .transform((val) => val === "true"),
        total: string()
            .refine((val) => val.trim() !== "", {
                message: "Total is not allowed",
            })
            .transform((val) => parseFloat(val))
            .refine((val) => !isNaN(val) && val > 0, {
                message: "Total must be a positive number",
            })
            .optional(),
    }).strict(),
});

export type CreateReceiptInput = TypeOf<typeof createReceiptSchema>;

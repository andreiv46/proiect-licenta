import { object, string, TypeOf } from "zod";

export const createExpenseCategorySchema = object({
    body: object({
        name: string({
            required_error: "Name is required",
        }).min(2, "Name is too short"),
        description: string().min(2, "Description is too short").optional(),
    }).strict(),
});

export type CreateExpenseCategoryInput = TypeOf<
    typeof createExpenseCategorySchema
>;

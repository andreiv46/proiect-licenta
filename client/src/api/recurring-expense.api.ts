import { User } from "@/contexts/auth.context";
import { UseQueryResult, useQuery } from "react-query";
import axios from "axios";

export interface ExpenseCategory {
    _id: string;
    name: string;
    description?: string;
    iconFilePath: string;
}

export enum Frequency {
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY",
    YEARLY = "YEARLY",
}

export interface RecurringExpense {
    _id: string;
    user: User["_id"];
    category: ExpenseCategory;
    name: string;
    description?: string;
    amount: number;
    frequency: Frequency;
    startDate: Date;
    endDate?: Date;
    nextPaymentDate: Date;
    recipient?: string;
}

const getRecurringExpenses = async (): Promise<RecurringExpense> => {
    return axios.get("/recurring-expense").then((res) => res.data);
};

export const useRecurringExpenses = () : UseQueryResult<RecurringExpense[]> => {
    return useQuery({
        queryKey: ["recurring-expenses"],
        queryFn: getRecurringExpenses,
        staleTime: 1000 * 30,
    });
};
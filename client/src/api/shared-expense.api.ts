import { useQuery, UseQueryResult } from "react-query";
import axios, { AxiosResponse } from "axios";

export interface SharedExpenseUser {
    _id: string;
    username: string;
}

export interface SharedExpenseFriend {
    user: SharedExpenseUser;
    amount: number;
    sharePaid: boolean;
}

export interface SharedExpense {
    _id: string;
    owner: SharedExpenseUser;
    ownerAmount: number;
    totalAmount: number;
    name: string;
    paymentInfo?: string;
    description?: string;
    frequency: string;
    startDate: string;
    endDate?: string;
    recipient?: string;
    friends: SharedExpenseFriend[];
    nextPaymentDate: string;
}

export interface UserSharedExpense {
    _id: string;
    isOwner: boolean;
    sharedExpense: SharedExpense;
    notify: boolean;
}

const getSharedExpenses = async (): Promise<UserSharedExpense[]> => {
    console.log("Fetching shared expenses");
    return axios
        .get("/shared-expense/")
        .then((response: AxiosResponse<UserSharedExpense[]>) => response.data);
};

export const useSharedExpensesQuery = (): UseQueryResult<
    UserSharedExpense[]
> => {
    return useQuery({
        queryKey: ["shared-expense"],
        queryFn: getSharedExpenses,
        staleTime: 1000 * 30,
    });
};

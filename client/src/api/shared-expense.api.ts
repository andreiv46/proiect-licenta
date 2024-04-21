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

export interface SharedExpenseInvite {
    _id: string;
    sharedExpense: SharedExpense;
    user: SharedExpenseUser;
    invitedBy: SharedExpenseUser;
    amount: number;
    status: string;
    createdAt: Date;
}

const getSharedExpenses = async (): Promise<UserSharedExpense[]> => {
    console.log("Fetching shared expenses");
    return axios
        .get("/shared-expense/")
        .then((response: AxiosResponse<UserSharedExpense[]>) => response.data);
};

const getSharedExpenseInvites = async (): Promise<SharedExpenseInvite[]> => {
    console.log("Fetching shared expense invites");
    return axios
        .get("/shared-expense/invites")
        .then(
            (response: AxiosResponse<SharedExpenseInvite[]>) => response.data
        );
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

export const useSharedExpenseInvitesQuery = (): UseQueryResult<
    SharedExpenseInvite[]
> => {
    return useQuery({
        queryKey: ["shared-expense-invites"],
        queryFn: getSharedExpenseInvites,
        staleTime: 1000 * 30,
    });
};

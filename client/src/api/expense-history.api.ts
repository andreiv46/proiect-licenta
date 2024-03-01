import { useQuery, UseQueryResult } from "react-query";
import axios, { AxiosResponse } from "axios";

export interface ExpenseHistory {
    _id: string;
    amount: number;
    description: string;
    date: string;
    recipient?: string;
}

const getExpenseHistory = async (): Promise<ExpenseHistory[]> => {
    console.log("Fetching expense history");
    return axios
        .get("/expense-history/")
        .then((response: AxiosResponse<ExpenseHistory[]>) => response.data);
};

export const useExpenseHistoryQuery = (): UseQueryResult<
    ExpenseHistory[],
    unknown
> => {
    return useQuery<ExpenseHistory[], unknown>({
        queryKey: ["expense-history"],
        queryFn: getExpenseHistory,
        staleTime: 1000 * 30,
    });
};

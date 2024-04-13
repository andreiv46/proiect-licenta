import axios, { AxiosResponse } from "axios";
import { UseQueryResult, useQuery } from "react-query";

export interface ExpensePerMonth {
    year: number;
    month: number;
    total: number;
    count: number;
}

export interface PersonalPaymentsOverview {
    lastSixMonths: ExpensePerMonth[];
    total: number;
    count: number;
}

const getPersonalPaymentsOverview =
    async (): Promise<PersonalPaymentsOverview> => {
        return axios
            .get("/analytics/overview/personal-payments")
            .then((response: AxiosResponse) => response.data);
    };

export const usePersonalPaymentsOverviewQuery =
    (): UseQueryResult<PersonalPaymentsOverview> => {
        return useQuery<PersonalPaymentsOverview, unknown>({
            queryKey: ["personal-payments-overview"],
            queryFn: getPersonalPaymentsOverview,
            cacheTime: 1000 * 60 * 5,
        });
    };

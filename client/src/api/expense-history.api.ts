import { useQuery } from "react-query";
import axios from "axios";

const getExpenseHistory = () => {
    console.log("Fetching expense history");
    return axios.get("/expense-history/");
};

export const useExpenseHistoryQuery = () => {
    return useQuery({
        queryKey: ["expense-history"],
        queryFn: getExpenseHistory,
        staleTime: 1000 * 30,
        // select: (data) => data.data,
    });
};

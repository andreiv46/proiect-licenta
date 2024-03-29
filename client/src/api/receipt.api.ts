import {
    useQuery,
    UseQueryResult,
    useInfiniteQuery,
    useMutation,
    useQueryClient,
} from "react-query";
import axios, { AxiosResponse } from "axios";

export interface Item {
    _id: string;
    description: string;
    price: number;
    quantity?: number;
    totalPrice: number;
    quantityUnit?: string;
}

export interface Receipt {
    _id: string;
    merchantName?: string;
    merchantPhoneNumber?: string;
    merchantAddress?: string;
    total: number;
    transactionDate?: Date;
    transactionTime?: string;
    subtotal?: number;
    totalTax?: number;
    items?: Item[];
    analyzed: boolean;
    base64File?: string;
}

const getAllReceipts = async (): Promise<Receipt[]> => {
    console.log("Fetching all receipts");
    return axios
        .get("/receipt/")
        .then((response: AxiosResponse<Receipt[]>) => response.data);
};

const getReceipts = async (
    offset: number = 0,
    limit: number
): Promise<{
    receipts: Receipt[];
    receiptsCount: number;
    prevOffset: number;
}> => {
    console.log("Fetching receipts");
    return axios.get(`/receipt/?limit=${limit}&offset=${offset}`).then(
        (
            response: AxiosResponse<{
                receipts: Receipt[];
                receiptsCount: number;
            }>
        ) => {
            return {
                ...response.data,
                prevOffset: offset,
            };
        }
    );
};

const createReceipt = async (data: FormData): Promise<Receipt> => {
    console.log("Creating receipt");
    return axios
        .post("/receipt/", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((response: AxiosResponse<Receipt>) => response.data);
};

export const useAllReceiptsQuery = (): UseQueryResult<Receipt[], unknown> => {
    return useQuery<Receipt[], unknown>({
        queryKey: ["all-receipts"],
        queryFn: getAllReceipts,
        staleTime: 1000 * 60,
    });
};

export const useInfiniteReceiptsQuery = () => {
    return useInfiniteQuery({
        queryKey: ["receipts", 0],
        queryFn: ({ pageParam = 0 }) => getReceipts(pageParam, 6),
        getNextPageParam: (lastPage) => {
            if (lastPage.prevOffset + 6 >= lastPage.receiptsCount) {
                return false;
            }
            return lastPage.prevOffset + 6;
        },
        staleTime: 1000 * 60 * 5,
    });
};

export const useCreateReceiptMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<Receipt, unknown, FormData, unknown>(createReceipt, {
        onSuccess: () => {
            queryClient.invalidateQueries("receipts");
        },
    });
};

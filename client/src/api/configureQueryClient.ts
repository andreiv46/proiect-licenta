import { QueryClient } from "react-query";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";

const handleQueryError = (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.data.message) {
        let errorMessage = error.response?.data.message;
        if (Array.isArray(errorMessage)) {
            errorMessage = errorMessage.map((err) => err.message).join(" ");
        }
        console.log(errorMessage);
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: errorMessage,
        });
    } else {
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "An unknown error occurred.",
        });
    }
};

const handleQuerySuccess = (data: unknown) => {
    if (typeof data === "object" && data !== null && "message" in data) {
        toast({
            title: "Success!",
            description: (data as { message: string })?.message,
        });
    }
};

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 0,
            onError: handleQueryError,
            onSuccess: handleQuerySuccess,
        },
        mutations: {
            onError: handleQueryError,
            onSuccess: handleQuerySuccess,
            retry: 0,
        },
    },
});

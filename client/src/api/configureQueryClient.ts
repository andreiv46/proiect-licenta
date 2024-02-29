import { QueryClient } from "react-query";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";

const handleQueryError = (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.data.message) {
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: error.response?.data.message,
        });
    } else {
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "An unknown error occurred.",
        });
    }
};

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 0,
            onError: handleQueryError,
        },
    },
});

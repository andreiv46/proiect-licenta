import { UseQueryResult, useMutation, useQuery } from "react-query";
import axios, { AxiosError } from "axios";
import { LoginResponse } from "@/contexts/auth.context";
import { User } from "@/contexts/auth.context";

export interface LoginInput {
    email: string;
    password: string;
}

export interface RegisterInput {
    username: string;
    email: string;
    password: string;
}

const login = async (input: LoginInput): Promise<LoginResponse> => {
    console.log("Logging in");
    return axios.post("/auth/login", input).then((response) => response.data);
};

const register = async (input: RegisterInput): Promise<User> => {
    console.log("Registering");
    return axios
        .post("/auth/register", input)
        .then((response) => response.data);
};

export const getCurrentUser = async (): Promise<User> => {
    console.log("Fetching current userS");
    return axios.get("/auth/current").then((response) => response.data);
};

export const useLoginMutation = () => {
    return useMutation<LoginResponse, AxiosError, LoginInput, unknown>(login);
};

export const useRegisterMutation = () => {
    return useMutation<User, AxiosError, RegisterInput, unknown>(register);
};

export const useGetCurrentUserQuery = (): UseQueryResult<User, unknown> => {
    return useQuery<User, AxiosError>({
        queryKey: ["current-user"],
        queryFn: getCurrentUser,
        onError: (error) => {
            console.error(error);
        },
    });
};

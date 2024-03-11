import {
    useLoginMutation,
    useRegisterMutation,
    getCurrentUser,
} from "@/api/auth.api";
import { LoginInput, RegisterInput } from "@/api/auth.api";
import { setAxiosAuthHeader } from "@/api/configureAxios";
import {
    createContext,
    useMemo,
    useState,
    useEffect,
    ReactNode,
    useCallback,
} from "react";

export interface User {
    _id: string;
    username: string;
    email: string;
}

export interface LoginResponse {
    user: User;
    token: string;
}

export interface AuthContextType {
    user?: User;
    login: (input: LoginInput) => Promise<boolean>;
    register: (input: RegisterInput) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>(
    {} as AuthContextType
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { mutateAsync: loginMutationAsync } = useLoginMutation();
    const { mutateAsync: registerMutationAsync } = useRegisterMutation();
    const [user, setUser] = useState<User>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        setIsLoading(true);
        if (localStorage.getItem("token")) {
            getCurrentUser()
                .then((user) => {
                    setUser(user);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = useCallback(
        async (input: LoginInput): Promise<boolean> => {
            setIsLoading(true);
            try {
                const response = await loginMutationAsync(input);
                setUser(response.user);
                localStorage.setItem("token", response.token);
                setAxiosAuthHeader(response.token);
                setIsLoading(false);
                return true;
            } catch (error) {
                return false;
            } finally {
                setIsLoading(false);
            }
        },
        [loginMutationAsync]
    );

    const register = useCallback(
        async (input: RegisterInput): Promise<void> => {
            await registerMutationAsync(input);
        },
        [registerMutationAsync]
    );

    const logout = useCallback(() => {
        setUser(undefined);
        localStorage.removeItem("token");
    }, []);

    const values = useMemo(
        () => ({
            user,
            login,
            register,
            logout,
            isLoading,
        }),
        [user, login, register, logout, isLoading]
    );

    return (
        <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
    );
};

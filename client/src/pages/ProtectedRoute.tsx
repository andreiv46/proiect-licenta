import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "lucide-react";

const ProtectedRoute = () => {
    const { user, isLoading } = useAuth();
    const token = localStorage.getItem("token");

    if (isLoading) {
        return <Loader className="m-auto animate-spin" />;
    }

    if (!user && !token) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;

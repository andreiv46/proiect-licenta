import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const ProtectedRoute = () => {
    const { user, isLoading } = useAuth();
    const token = localStorage.getItem("token");

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!user && !token) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;

import LoginForm from "@/components/LoginForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            navigate("/");
        }
    }, [token, navigate]);

    return (
        <div className="flex items-center justify-center h-full mt-8">
            <LoginForm />
        </div>
    );
};

export default Login;

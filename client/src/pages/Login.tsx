import LoginForm from "@/components/LoginForm";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    if (token) {
        navigate("/");
    }

    return (
        <div className="flex items-center justify-center h-full">
            <LoginForm />
        </div>
    );
};

export default Login;

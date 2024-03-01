import { useAuth } from "@/hooks/useAuth";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
    };

    return (
        <header className="flex items-center h-16 px-4 border-b bg-white w-full dark:bg-gray-950 md:px-6">
            <nav className="flex items-center w-full justify-between">
                <a className="font-semibold" href="#">
                    Logo
                </a>
                <nav className="flex items-center justify-end flex-1 gap-4 ml-4">
                    {user ? (
                        <Button
                            className="font-semibold"
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    ) : (
                        <Button
                            className="font-semibold"
                            onClick={() => {
                                navigate("/login");
                            }}
                        >
                            Login
                        </Button>
                    )}
                </nav>
            </nav>
        </header>
    );
};
export default NavBar;

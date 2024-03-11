import { useAuth } from "@/hooks/useAuth";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import UserItem from "./UserItem";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

const NavBar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

    useEffect(() => {
        function handleResize() {
            setIsMobileView(window.innerWidth < 768);
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleLogout = () => {
        logout();
    };

    const items = [
        { name: "Home", to: "/home" },
        { name: "Profile", to: "/profile" },
        { name: "Expense History", to: "/expense-history" },
    ];

    return (
        <nav className="inset-x-0 top-0 z-50 bg-white shadow-sm translate-y-0/hidden md:translate-y-0 dark:bg-gray-950">
            <div className="container flex items-center justify-between h-14 px-4 md:px-6">
                <Link className="h-10 w-10 bg-green-500 rounded-full" to="/">
                    <Avatar>
                        <AvatarImage src="/duck.png" alt="Home" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Companie</span>
                </Link>

                {!isMobileView && (
                    <nav className="hidden space-x-4 md:flex">
                        {items.map((item) => (
                            <Button
                                className="flex items-center h-8 px-2 rounded-md text-sm font-medium transition-colors hover:text-gray-900 focus:text-gray-900 focus:outline-none"
                                key={item.name}
                                onClick={() => navigate(item.to)}
                                variant="link"
                            >
                                {item.name}
                            </Button>
                        ))}
                    </nav>
                )}

                {isMobileView && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                                Menu
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Navigation</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {items.map((item) => (
                                <DropdownMenuItem
                                    key={item.name}
                                    onClick={() => navigate(item.to)}
                                >
                                    {item.name}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}

                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <UserItem user={user} />
                            <Button
                                className="font-semibold"
                                variant="outline"
                                size="sm"
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Button
                            className="font-semibold"
                            variant="outline"
                            size="sm"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
};
export default NavBar;

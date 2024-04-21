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
import {
    LogIn,
    LogOut,
    AlignJustify,
    Coins,
    BarChart3,
    Users,
} from "lucide-react";

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
        { name: "Personal Expenses", to: "/expenses", icon: Coins },
        { name: "Shared Expenses", to: "/shared-expenses", icon: Users },
        { name: "Analytics", to: "/analytics", icon: BarChart3 },
    ];

    return (
        <nav className="inset-x-0 top-0 z-50 bg-white shadow-lg translate-y-0/hidden md:translate-y-0 dark:bg-gray-950">
            <div className="w-full flex items-center justify-between h-16 px-4 md:px-6">
                <Link
                    className="flex items-center w-auto h-10 bg-slate-100 rounded-full shadow-2xl"
                    to="/"
                >
                    <Avatar>
                        <AvatarImage src="/duck.png" alt="Home" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <svg
                        height="30"
                        width="84"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <text
                            x="0"
                            y="22"
                            fill="#4E8BF7"
                            fontSize="24"
                            fontFamily="Lily Script One"
                            fontStyle="italic"
                            fontWeight="900"
                        >
                            $pendy
                        </text>
                    </svg>
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
                                <span className="mr-2">
                                    <item.icon className="h-4 w-4" />
                                </span>
                                {item.name}
                            </Button>
                        ))}
                    </nav>
                )}

                {isMobileView && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                                <span className="mr-2">
                                    <AlignJustify className="h-4 w-4" />
                                </span>
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
                                    <span className="mr-2">
                                        <item.icon className="h-4 w-4" />
                                    </span>
                                    {item.name}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}

                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <div
                                className="hover:bg-gray-200 cursor-pointer"
                                onClick={() => navigate("/profile")}
                            >
                                <UserItem user={user} />
                            </div>
                            <Button
                                className="font-semibold"
                                variant="outline"
                                size="sm"
                                onClick={handleLogout}
                            >
                                Logout
                                <span className="ml-2">
                                    <LogOut className="h-3 w-3" />
                                </span>
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
                            <span className="ml-2">
                                <LogIn className="h-3 w-3" />
                            </span>
                        </Button>
                    )}
                </div>
            </div>
            <link
                href="https://fonts.googleapis.com/css2?family=Lily+Script+One&family=Madimi+One&display=swap"
                rel="stylesheet"
            />
        </nav>
    );
};
export default NavBar;

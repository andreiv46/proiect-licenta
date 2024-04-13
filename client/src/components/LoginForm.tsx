import {
    Card,
    CardContent,
    CardTitle,
    CardHeader,
    CardDescription,
    CardFooter,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { LoginInput } from "@/api/auth.api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const LoginForm = () => {
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async () => {
        const input: LoginInput = {
            email: email || "",
            password: password || "",
        };
        const loggedIn = await login(input);
        console.log(loggedIn);
        if (loggedIn) {
            navigate("/analytics");
        }
    };

    return (
        <Card className="w-1/2">
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        placeholder="johndoe@gamil.com"
                        required
                        type="email"
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        required
                        type="password"
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        placeholder="**********************"
                    />
                </div>
            </CardContent>
            <CardFooter className="flex-col">
                <Link to="/register" className="text-blue-500 mb-2">
                    Don't have an account?
                </Link>
                <Button className="w-full" onClick={handleLogin}>
                    Login
                </Button>
            </CardFooter>
        </Card>
    );
};

export default LoginForm;

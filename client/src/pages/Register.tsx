import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Register = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const { register } = useAuth();

    useEffect(() => {
        if (token) {
            navigate("/");
        }
    }, [token, navigate]);

    const handleRegister = async () => {
        const input = {
            email: email,
            password: password,
            username: username,
        };
        await register(input);
        navigate("/login");
    };

    return (
        <div className="flex items-center justify-center h-full mt-8">
            <Card className="w-1/2">
                <CardHeader>
                    <CardTitle>Register</CardTitle>
                    <CardDescription>
                        Create an account to get started.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            placeholder="johndoe@gmail.com"
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
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            required
                            onChange={(e) => {
                                setUsername(e.target.value);
                            }}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex-col">
                    <Link to="/login" className="text-blue-500 mb-2">
                        Already have an account?
                    </Link>
                    <Button className="w-full" onClick={handleRegister}>
                        Login
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Register;

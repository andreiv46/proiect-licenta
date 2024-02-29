import { AxiosError } from "axios";
import { useExpenseHistoryQuery } from "@/api/expense-history.api";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Expense {
    _id: string;
    amount: number;
    description: string;
    date: string;
}

const Home = () => {
    const navigate = useNavigate();

    const { data, error, isError, isLoading } = useExpenseHistoryQuery();

    if (isLoading) return <div>Loading...</div>;
    if (isError) {
        return (
            <div>
                Error: {(error as AxiosError)?.message} {}
            </div>
        );
    }

    return (
        <div>
            <h1>Home</h1>
            <Button
                onClick={() => {
                    navigate("/profile");
                }}
            >
                Profile
            </Button>
            <div>
                {data?.data.map((expense: Expense) => (
                    <Card key={expense._id} className="w-[350px]">
                        <CardHeader>
                            <CardTitle>{expense.description}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>{expense.amount}</CardDescription>
                        </CardContent>
                        <CardFooter>
                            <CardDescription>{expense.date}</CardDescription>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};
export default Home;

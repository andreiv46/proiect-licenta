import {
    Bar,
    BarChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";
import { ExpensePerMonth } from "@/api/analytics.api";

export const Overview: React.FC<{
    personalPaymentsLastSixMonths: ExpensePerMonth[];
}> = ({ personalPaymentsLastSixMonths }) => {
    const personalPaymentData = personalPaymentsLastSixMonths
        .reverse()
        .map((personalPayment) => {
            const date = new Date(
                personalPayment.year,
                personalPayment.month - 1
            );
            const formattedMonth = date.toLocaleString("default", {
                month: "short",
                year: "numeric",
            });
            return {
                month: formattedMonth,
                total: personalPayment.total,
            };
        });

    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={personalPaymentData} barSize={20}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" stackId="a" fill="#8884d8" />
                <Bar dataKey="total" stackId="a" fill="#82ca9d" />
            </BarChart>
        </ResponsiveContainer>
    );
};

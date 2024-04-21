import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "@/components/Overview";
import { DollarSign, Loader, TrendingDown, TrendingUp } from "lucide-react";
import {
    PersonalPaymentsOverview,
    usePersonalPaymentsOverviewQuery,
} from "@/api/analytics.api";

const increasedPercentage = (
    current: number = 0,
    previous: number = 0
): number => {
    if (previous === 0) {
        return 100;
    }
    return ((current - previous) / previous) * 100;
};

const renderPersonalPaymentChange = (
    personalPaymentsOverview: PersonalPaymentsOverview,
    personalPaymentPercentageChange: number
) => {
    const monthYear1 = personalPaymentsOverview?.lastSixMonths?.[0]
        ? `${personalPaymentsOverview.lastSixMonths[0].month}/${personalPaymentsOverview.lastSixMonths[0].year}`
        : "";

    const monthYear2 = personalPaymentsOverview?.lastSixMonths?.[1]
        ? `${personalPaymentsOverview.lastSixMonths[1].month}/${personalPaymentsOverview.lastSixMonths[1].year}`
        : "";

    const change = personalPaymentPercentageChange.toFixed(2);
    const moreOrLess = personalPaymentPercentageChange > 0 ? "more" : "less";
    const moreOrLessIcon =
        personalPaymentPercentageChange > 0 ? (
            <TrendingUp size={16} color="blue" />
        ) : (
            <TrendingDown size={16} color="red" />
        );

    return (
        <div className="flex">
            {moreOrLessIcon}{" "}
            <p className="ml-1">
                {" "}
                In {monthYear1}, you spent {change}% {moreOrLess} than in{" "}
                {monthYear2}
            </p>
        </div>
    );
};

const Analytics = () => {
    const {
        data: personalPaymentsOverview,
        isLoading,
        isError,
    } = usePersonalPaymentsOverviewQuery();

    if (isLoading) {
        return <Loader className="animate-spin" />;
    }

    if (isError) {
        return <div>Internal server error</div>;
    }

    const personalPaymentPercentageChange = increasedPercentage(
        personalPaymentsOverview?.lastSixMonths?.[0]?.total || 0,
        personalPaymentsOverview?.lastSixMonths?.[1]?.total || 0
    );

    return (
        <>
            <div className="flex-col md:flex">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <div className="flex items-center justify-between space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">
                            Dashboard
                        </h2>
                        <div className="flex items-center space-x-2">
                            <Button>Export CSV</Button>
                        </div>
                    </div>
                    <Tabs defaultValue="overview" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="receipts" disabled>
                                Receipts
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="overview" className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Total Expenses
                                        </CardTitle>
                                        <DollarSign
                                            size={16}
                                            className="text-muted-foreground"
                                        />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            $
                                            {personalPaymentsOverview?.total ||
                                                0 + 0}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            All Time Personal Payments
                                        </CardTitle>
                                        <DollarSign
                                            size={16}
                                            className="text-muted-foreground"
                                        />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            ${personalPaymentsOverview?.total}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {personalPaymentsOverview &&
                                                renderPersonalPaymentChange(
                                                    personalPaymentsOverview,
                                                    personalPaymentPercentageChange
                                                )}
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            All Time Shared Payments
                                        </CardTitle>
                                        <DollarSign
                                            size={16}
                                            className="text-muted-foreground"
                                        />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            $12,234
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            +19% from last month
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            All Time Payments made
                                        </CardTitle>
                                        <DollarSign
                                            size={16}
                                            className="text-muted-foreground"
                                        />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {personalPaymentsOverview?.count ||
                                                0 + 0}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                                <Card className="col-span-4">
                                    <CardHeader>
                                        <CardTitle>
                                            Overview for the last 6 months
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pl-2">
                                        <Overview
                                            personalPaymentsLastSixMonths={
                                                personalPaymentsOverview?.lastSixMonths ||
                                                []
                                            }
                                        />
                                    </CardContent>
                                </Card>
                                <Card className="col-span-3">
                                    <CardHeader>
                                        <CardTitle>Recent Sales</CardTitle>
                                        <CardDescription>
                                            You made 265 sales this month.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {/* <RecentSales /> */}
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    );
};

export default Analytics;

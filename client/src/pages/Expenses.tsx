import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReceiptText, CalendarRange } from "lucide-react";

const Expenses = () => {
    return (
        <div className="flex justify-center mt-2">
            <Tabs defaultValue="expenses" className="w-3/4">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="receipts">
                        <span className="mr-2">
                            <ReceiptText className="h-4 w-4" />
                        </span>
                        Receipts
                    </TabsTrigger>
                    <TabsTrigger value="recurring-payments">
                        <span className="mr-2">
                            <CalendarRange className="h-4 w-4" />
                        </span>
                        Recurring payments
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="receipts">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your receipts</CardTitle>
                            <CardDescription>lalalalala</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <svg
                                    height="30"
                                    width="200"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <text
                                        x="5"
                                        y="15"
                                        fill="#4E8BF7"
                                        fontSize="20"
                                        fontFamily="Lily Script One"
                                        fontStyle="italic"
                                        fontWeight="900"
                                    >
                                        $pendy
                                    </text>
                                </svg>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>Add new Receipt</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="recurring-payments">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recurring payments</CardTitle>
                            <CardDescription>
                                recurring payments
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>test</div>
                        </CardContent>
                        <CardFooter>
                            <Button>idk</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Expenses;

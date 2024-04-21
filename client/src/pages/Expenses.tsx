import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Item,
    useInfiniteReceiptsQuery,
    useCreateReceiptMutation,
} from "@/api/receipt.api";
import { useRecurringExpenses } from "@/api/recurring-expense.api";
import InfiniteScroll from "react-infinite-scroll-component";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import {
    ReceiptText,
    CalendarRange,
    Store,
    Pencil,
    Loader,
    Upload,
    CircleFadingPlus,
    History,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import ExpenseHistory from "./ExpenseHistory";

const ItemsTable = ({ items }: { items: Item[] }) => {
    return (
        <Table>
            <TableCaption>Items</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total Price</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {items.map((item) => (
                    <TableRow key={item.description} className="shadow-md">
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.price}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.totalPrice}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

const AddReceipt = () => {
    const [receiptName, setReceiptName] = useState("");
    const [receiptTotal, setReceiptTotal] = useState(0);
    const [analyzeReceipt, setAnalyzeReceipt] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const toast = useToast();
    const {
        mutateAsync: createReceiptMutation,
        isLoading: createReceiptIsLoading,
    } = useCreateReceiptMutation();
    const [dialogOpen, setDialogOpen] = useState(false);

    const hadleUpload = async () => {
        if (receiptName.trim() === "") {
            toast.toast({
                variant: "destructive",
                title: "Name is required",
            });
            return;
        }
        if (receiptTotal <= 0) {
            toast.toast({
                variant: "destructive",
                title: "Total must be greater than 0",
            });
            return;
        }
        if (!file) {
            toast.toast({
                variant: "destructive",
                title: "File is required",
            });
            return;
        }
        const formData = new FormData();
        formData.append("name", receiptName);
        formData.append("total", receiptTotal.toString());
        formData.append("analyzeReceipt", analyzeReceipt.toString());
        formData.append("receipt", file);
        const response = await createReceiptMutation(formData);
        if (response) {
            console.log(response);
            toast.toast({
                title: "Receipt created",
            });
        }
        setDialogOpen(false);
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    className="flex justify-center group rounded-xl"
                    variant={"secondary"}
                >
                    <CircleFadingPlus className="h-4 w-4 mr-2 group-hover:animate-bounce" />
                    Add Receipt
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Receipt</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Upload and analyze your receipt
                </DialogDescription>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            className="col-span-3"
                            onChange={(e) => setReceiptName(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="total" className="text-right">
                            Total
                        </Label>
                        <Input
                            id="total"
                            className="col-span-3"
                            type="number"
                            min="0"
                            onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                if (value >= 0) {
                                    setReceiptTotal(value);
                                }
                            }}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="file" className="text-right">
                            Receipt
                        </Label>
                        <Input
                            id="file"
                            className="col-span-3"
                            type="file"
                            accept=".png, .jpeg, .jpg,"
                            onChange={(e) => {
                                if (e.target.files) {
                                    setFile(e.target.files[0]);
                                }
                            }}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="analyze" className="text-right">
                        Analyze
                    </Label>
                    <Checkbox
                        id="analyze"
                        className="col-span-3"
                        checked={analyzeReceipt}
                        onCheckedChange={(checked) => {
                            if (typeof checked === "boolean") {
                                setAnalyzeReceipt(checked);
                            }
                        }}
                    />
                </div>
                <DialogFooter>
                    <Button
                        className="flex justify-center"
                        onClick={hadleUpload}
                    >
                        {createReceiptIsLoading ? (
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Upload className="mr-2 h-4 w-4" />
                        )}
                        Upload
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const Receipts = () => {
    const { data, fetchNextPage, hasNextPage, isLoading } =
        useInfiniteReceiptsQuery();

    const receipts = data?.pages.flatMap((page) => page.receipts);

    if (isLoading) return <Loader className="animate-spin" />;

    return (
        <div>
            {!receipts ? (
                <div>No receipts found</div>
            ) : (
                <InfiniteScroll
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:grid-cols-3 p-4 md:p-6"
                    dataLength={receipts ? receipts.length : 0}
                    next={() => fetchNextPage()}
                    hasMore={hasNextPage || false}
                    loader={<Loader className="h-12 w-12 animate-spin" />}
                >
                    {receipts?.map((receipt) => (
                        <div
                            key={receipt._id}
                            className="rounded-lg overflow-hidden shadow-sm hover:shadow-2xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-101 cursor-pointer"
                        >
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Card className="bg-emerald-200 h-[475px]">
                                        <CardContent className="p-0">
                                            {receipt.base64File ? (
                                                <img
                                                    alt="Receipt"
                                                    className="aspect-[1] object-cover"
                                                    src={`data:image/png;base64,${receipt.base64File}`}
                                                />
                                            ) : (
                                                <img
                                                    alt="Receipt Placeholder"
                                                    className="aspect-[1] object-cover"
                                                    height={400}
                                                    src="/duck.png"
                                                    width={600}
                                                />
                                            )}
                                        </CardContent>
                                        <CardContent className="p-4 md:p-6">
                                            {receipt.analyzed ? (
                                                <Badge className="bg-green-500">
                                                    Analyzed
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-red-400 hover:bg-red-500">
                                                    Not analyzed
                                                </Badge>
                                            )}
                                            <h3 className="font-semibold text-lg md:text-xl flex items-center">
                                                <Store className="h-4 w-4 mr-2" />
                                                {receipt.merchantName ?? "N/A"}
                                            </h3>
                                            <p className="text-sm flex">
                                                Transaction Date:{" "}
                                                {receipt.transactionTime ??
                                                    "N/A"}
                                            </p>
                                            <p className="text-sm">
                                                Total: {receipt.total ?? 0}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[750px]">
                                    <DialogHeader>
                                        <DialogTitle>
                                            #{receipt._id}
                                        </DialogTitle>
                                        <DialogDescription className="shadow-md">
                                            Merchant:{" "}
                                            {receipt.merchantName ?? "unknown"}
                                            <br />
                                            Transaction Date:{" "}
                                            {receipt.transactionDate
                                                ? receipt.transactionDate.toString()
                                                : "unknown"}
                                            <br />
                                            Total: {receipt.total ?? "unknown"}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <ScrollArea className="h-96">
                                        <div>
                                            {receipt.base64File ? (
                                                <img
                                                    alt="Receipt"
                                                    className="object-cover"
                                                    src={`data:image/png;base64,${receipt.base64File}`}
                                                />
                                            ) : (
                                                <img
                                                    alt="Receipt Placeholder"
                                                    className="aspect-[1] object-cover"
                                                    height={400}
                                                    src="/duck.png"
                                                    width={600}
                                                />
                                            )}
                                            {receipt.items && (
                                                <ItemsTable
                                                    items={receipt.items}
                                                />
                                            )}
                                        </div>
                                    </ScrollArea>
                                    <DialogFooter>
                                        <Button className="flex justify-center">
                                            <Pencil className="h-4 w-4 mr-2" />
                                            Edit
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    ))}
                </InfiniteScroll>
            )}
        </div>
    );
};

const RecurringPayments = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDateClick = (arg: any) => {
        alert(arg.event.id);
    };
    const { data: recurringExpenses, isLoading } = useRecurringExpenses();
    if (isLoading) return <Loader className="animate-spin" />;
    if (!recurringExpenses) return <div>No recurring expenses found</div>;

    return (
        recurringExpenses && (
            <div>
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={recurringExpenses.map((expense) => ({
                        title: `${expense.name} - ${expense.amount}$`,
                        date: expense.nextPaymentDate,
                        id: expense._id,
                        className:
                            "cursor-pointer whitespace-normal overflow-hidden overflow-ellipsis w-full",
                    }))}
                    eventClick={handleDateClick}
                    displayEventTime={false}
                    dayMaxEventRows={4}
                    aspectRatio={1.8}
                />
            </div>
        )
    );
};

const Expenses = () => {
    return (
        <div className="flex justify-center mt-2">
            <Tabs defaultValue="receipts" className="w-3/4">
                <TabsList className="grid w-full grid-cols-3">
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
                    <TabsTrigger value="history">
                        <span className="mr-2">
                            <History className="h-4 w-4" />
                        </span>
                        History
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="receipts">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <div className="flex items-center justify-between space-x-4">
                                    <div>Receipt Management System</div>
                                    <AddReceipt />
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Receipts />
                        </CardContent>
                        <CardFooter>
                            <Logo />
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="recurring-payments">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <div className="flex items-center justify-between space-x-4">
                                    <div>
                                        Recurring Payments Management System
                                    </div>
                                    <Button
                                        variant={"secondary"}
                                        className="group rounded-xl"
                                    >
                                        <CircleFadingPlus className="h-4 w-4 mr-2 group-hover:animate-bounce" />
                                        Add Recurring Payment
                                    </Button>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <RecurringPayments />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="history">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <div className="flex items-center justify-between space-x-4">
                                    <div>Past Payments</div>
                                    <Button
                                        variant={"secondary"}
                                        className="group rounded-xl"
                                    >
                                        <CircleFadingPlus className="h-4 w-4 mr-2 group-hover:animate-bounce" />
                                        Add Payment
                                    </Button>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="w-full">
                            <ExpenseHistory />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Expenses;

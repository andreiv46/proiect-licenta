import {
    ExpenseHistory as ExpenseHistoryType,
    useExpenseHistoryQuery,
} from "@/api/expense-history.api";
import { Column, ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

import { Checkbox } from "@/components/ui/checkbox";

interface SortingButtonProps {
    column: Column<ExpenseHistoryType>;
    columnName: string;
}

const SortingButton = ({ column, columnName }: SortingButtonProps) => {
    return (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            {columnName}
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    );
};

const labels = [
    {
        value: "card",
        label: "Card",
        color: "bg-blue-400",
    },
    {
        value: "bank",
        label: "Bank",
        color: "bg-yellow-400",
    },
    {
        value: "cash",
        label: "Cash",
        color: "bg-green-400",
    },
];

const columns: ColumnDef<ExpenseHistoryType>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        header: "Expense ID",
        accessorKey: "_id",
        cell: ({ row }) => (
            <div className="font-medium">{row.getValue("_id")}</div>
        ),
    },
    {
        header: "Description",
        accessorKey: "description",
        cell: ({ row }) => {
            // <div className="font-medium">{row.getValue("description")}</div>
            const label = labels[Math.floor(Math.random() * labels.length)];
            return (
                <div className="flex space-x-2">
                    {label && (
                        <Badge variant="secondary" className={label.color}>
                            {label.label}
                        </Badge>
                    )}
                    <span className="max-w-[500px] truncate font-medium">
                        {row.getValue("description")}
                    </span>
                </div>
            );
        },
    },
    {
        header: ({ column }) => {
            return (
                <div className="flex items-center justify-end">
                    <SortingButton column={column} columnName="Amount" />
                </div>
            );
        },
        accessorKey: "amount",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"));
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount);

            return <div className="text-right font-medium">{formatted}</div>;
        },
    },
    {
        header: ({ column }) => {
            return (
                <div className="flex items-center justify-end">
                    <SortingButton column={column} columnName="Date" />
                </div>
            );
        },
        accessorKey: "date",
        cell: ({ row }) => {
            const date = new Date(row.getValue("date"));
            return (
                <div className="text-right font-medium">
                    {date.toLocaleDateString(navigator.language)}
                </div>
            );
        },
    },
    {
        accessorKey: "recipient",
        header: ({ column }) => {
            return (
                <div className="flex items-center justify-end">
                    <SortingButton column={column} columnName="Recipient" />
                </div>
            );
        },
        cell: ({ row }) => {
            const recipient = row.getValue("recipient") as string;
            if (recipient) {
                return (
                    <div className="text-right font-medium">{recipient}</div>
                );
            }
            return <div className="text-right font-medium">-</div>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const expense = row.original;

            return (
                <div className="flex justify-center items-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() =>
                                    navigator.clipboard.writeText(expense._id)
                                }
                            >
                                Copy payment ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View customer</DropdownMenuItem>
                            <DropdownMenuItem>
                                View payment details
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];

const ExpenseHistory = () => {
    const { data: expenses, isError, isLoading } = useExpenseHistoryQuery();
    if (isLoading) return <div>Loading...</div>;
    if (isError) {
        return <div>Couldn't load expenses</div>;
    }
    return (
        expenses && (
            <div className="container mx-auto py-2 bg-green-50 shadow-2xl rounded-sm ">
                <DataTable columns={columns} data={expenses} />
            </div>
        )
    );
};

export default ExpenseHistory;

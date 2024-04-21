import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Handshake,
    Loader,
    CalendarDays,
    ClipboardCopy,
    Crown,
    BellRing,
    BellOff,
    Inbox,
    CircleFadingPlus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import {
    UserSharedExpense,
    SharedExpenseFriend,
    SharedExpenseInvite,
    useSharedExpensesQuery,
    useSharedExpenseInvitesQuery,
} from "@/api/shared-expense.api";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/Logo";

const SharedExpenseCard = ({
    sharedExpense,
}: {
    sharedExpense: UserSharedExpense;
}) => {
    const { user } = useAuth();
    const [isClicked, setIsClicked] = useState<boolean>(false);

    const date = new Date(sharedExpense.sharedExpense.nextPaymentDate);
    const nextPaymentDate = date.toLocaleDateString(navigator.language);
    const timeLeft =
        Math.round(
            (date.getTime() - new Date().getTime()) / (1000 * 3600 * 24)
        ) + 1;

    const sharedExpenseSum =
        sharedExpense.sharedExpense.totalAmount -
        sharedExpense.sharedExpense.ownerAmount -
        sharedExpense.sharedExpense.friends.reduce(
            (acc, friend) => acc + friend.amount,
            0
        );

    return (
        <Card className="border-2 border-gray-300 bg-white">
            <CardHeader>
                <CardTitle>
                    <div className="flex items-center justify-between space-x-4">
                        <div className="flex">
                            {sharedExpense.isOwner && (
                                <Badge className="text-white mr-1 text-lg bg-yellow-300 hover:bg-yellow-400">
                                    <Crown color="purple" />
                                </Badge>
                            )}
                            {sharedExpense.sharedExpense.name}
                        </div>
                        {sharedExpense.isOwner && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="h-8 w-8 p-0"
                                    >
                                        <span className="sr-only">
                                            Open menu
                                        </span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                        Actions
                                    </DropdownMenuLabel>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            console.log("Edit shared expense")
                                        }
                                    >
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                    <br />
                    <Badge className="text-white mr-1 text-lg">
                        {sharedExpense.sharedExpense.totalAmount} $
                    </Badge>
                    {sharedExpenseSum > 0 && (
                        <Badge
                            className="text-white text-lg"
                            variant={"destructive"}
                        >
                            <AlertCircle className="h-4 w-4 mr-1" />
                            Total amount not covered
                        </Badge>
                    )}
                </CardTitle>
                <CardDescription>
                    <div className="flex items-center justify-between space-x-4">
                        {sharedExpense.sharedExpense.description}
                        <div className="flex flex-col items-center">
                            <p>Next payment</p>
                            <b className="text-2xl text-slate-950">
                                {nextPaymentDate}
                            </b>
                            <Badge variant={"destructive"}>
                                {timeLeft} days left
                            </Badge>
                        </div>
                    </div>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Label htmlFor="payment-info" className="text-sm">
                    Payment info
                </Label>
                <div className="flex space-x-2">
                    <Input
                        id="payment-info"
                        value={sharedExpense.sharedExpense.paymentInfo}
                        defaultValue="not set"
                        readOnly
                    />
                    <Button
                        variant="secondary"
                        className={`shrink-0 ${
                            isClicked ? "animate-ping" : ""
                        }`}
                        onClick={() => {
                            navigator.clipboard.writeText(
                                sharedExpense.sharedExpense.paymentInfo || ""
                            );
                            setIsClicked(true);
                            setTimeout(() => setIsClicked(false), 500);
                        }}
                    >
                        <ClipboardCopy className="opacity-80" size="20" />
                    </Button>
                </div>
                <Separator className="my-4" />
                <div className="space-y-4">
                    <h4 className="text-sm font-medium">Users</h4>
                    <div className="grid gap-6">
                        {
                            <div className="flex items-center justify-between space-x-4">
                                <div className="flex items-center space-x-4">
                                    <Avatar>
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>OM</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="flex items-center">
                                            <Badge className="bg-green-500 text-white mr-1">
                                                Owner
                                            </Badge>
                                            <p className="text-sm font-medium leading-none">
                                                {
                                                    sharedExpense.sharedExpense
                                                        .owner.username
                                                }
                                            </p>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            User share:{" "}
                                            <b>
                                                {
                                                    sharedExpense.sharedExpense
                                                        .ownerAmount
                                                }
                                                $
                                            </b>
                                        </p>
                                    </div>
                                </div>
                                {sharedExpense.isOwner && (
                                    <Select
                                        defaultValue={
                                            sharedExpense.notify
                                                ? "notify"
                                                : "do-not-notify"
                                        }
                                    >
                                        <SelectTrigger className="ml-auto w-[60px]">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="notify">
                                                <BellRing size="16" />
                                            </SelectItem>
                                            <SelectItem value="do-not-notify">
                                                <BellOff size="16" />
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        }
                        {sharedExpense.sharedExpense.friends.map(
                            (friend: SharedExpenseFriend) => (
                                <div className="flex items-center justify-between space-x-4">
                                    <div className="flex items-center space-x-4">
                                        <Avatar>
                                            <AvatarImage src="https://github.com/shadcn.png" />
                                            <AvatarFallback>OM</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium leading-none">
                                                {friend.user.username}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                User share:{" "}
                                                <b>{friend.amount}$</b>
                                            </p>
                                        </div>
                                    </div>
                                    {user?.username ===
                                        friend.user.username && (
                                        <Select
                                            defaultValue={
                                                sharedExpense.notify
                                                    ? "notify"
                                                    : "do-not-notify"
                                            }
                                        >
                                            <SelectTrigger className="ml-auto w-[110px]">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="notify">
                                                    <BellRing size="16" />
                                                </SelectItem>
                                                <SelectItem value="do-not-notify">
                                                    <BellOff size="16" />
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>
                            )
                        )}
                        {sharedExpense.isOwner ? (
                            <>
                                <Separator className="mt-4" />
                                <div className="flex items-center justify-between space-x-4">
                                    <Logo />
                                    {sharedExpenseSum > 0 ? (
                                        <Button variant={"secondary"}>
                                            Invite friends
                                        </Button>
                                    ) : (
                                        <Button disabled variant={"secondary"}>
                                            Invite friends
                                        </Button>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Separator className="mt-4" />
                                <div className="flex items-center justify-between space-x-4">
                                    <Logo />
                                    <Button variant={"destructive"}>
                                        Leave group
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const SharedExpensesContent = () => {
    const {
        data: sharedExpenses,
        isLoading,
        isError,
    } = useSharedExpensesQuery();

    if (isLoading) {
        return <Loader className="animate-spin" />;
    }

    if (isError) {
        return <div>Error fetching shared expenses</div>;
    }

    if (!sharedExpenses) {
        return <div>No shared expenses</div>;
    }

    return sharedExpenses.map((sharedExpense: UserSharedExpense) => (
        <SharedExpenseCard sharedExpense={sharedExpense} />
    ));
};

const Invites = () => {
    const {
        data: invites,
        isLoading,
        isError,
    } = useSharedExpenseInvitesQuery();

    if (isLoading) {
        return <Loader className="animate-spin" />;
    }

    if (isError) {
        return <div>Error fetching shared expense invites</div>;
    }

    if (!invites || invites.length === 0) {
        return <div>No invites</div>;
    }

    return invites.map((invite: SharedExpenseInvite) => (
        <Card className="border-2 border-gray-300 bg-white mt-2">
            <CardHeader>
                <CardTitle>
                    <div className="flex items-center justify-between space-x-4">
                        <div className="flex items-center space-x-4">
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>OM</AvatarFallback>
                            </Avatar>
                            <div className="text-sm text-muted-foreground">
                                <p>{invite.invitedBy.username}</p>
                                <p>
                                    Invited you to join "
                                    {invite.sharedExpense.name}"
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <Button variant="secondary">Accept</Button>
                            <Button variant="destructive">Decline</Button>
                        </div>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p>Amount: {invite.amount}</p>
                <p>Frequency: {invite.sharedExpense.frequency}</p>
                <p>Recipient: {invite.sharedExpense.recipient || "Not set"}</p>
            </CardContent>
        </Card>
    ));
};

const SharedExpenses = () => {
    return (
        <div className="flex justify-center mt-2">
            <Tabs defaultValue="shared-payments" className="w-3/4">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="shared-payments">
                        <span className="mr-2">
                            <Handshake className="h-4 w-4" />
                        </span>
                        Shared payments
                    </TabsTrigger>
                    <TabsTrigger value="invites">
                        <span className="mr-2">
                            <Inbox className="h-4 w-4" />
                        </span>
                        Invites
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="shared-payments">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between space-x-4">
                                <CardTitle>Group Payment Manager</CardTitle>
                                <div>
                                    <Button variant="outline">
                                        <CircleFadingPlus className="h-4 w-4 mr-1" />
                                        Create New Group
                                    </Button>
                                    <Button variant="outline">
                                        <CalendarDays className="h-4 w-4 mr-1" />
                                        View On Calendar
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <SharedExpensesContent />
                        </CardContent>
                        <CardFooter>{/* <Logo /> */}</CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="invites">
                    <Card className="min-h-80">
                        <CardContent className="space-y-2">
                            <Invites />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default SharedExpenses;

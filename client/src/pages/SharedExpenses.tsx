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
    User,
    Handshake,
    Check,
    UserRoundX,
    UserRoundCheck,
    UserRoundPlus,
    Loader,
    UserRoundSearch,
    CalendarDays,
    UserRoundMinus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FriendItem } from "@/components/UserItem";
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
import { ReactNode, useState, useEffect } from "react";
import {
    useFriendsQuery,
    findFriend,
    useFriendRequestsQuery,
    useAcceptFriendRequestMutation,
    useRejectFriendRequestMutation,
    useCreateFriendRequestMutation,
    FindFriend,
} from "@/api/friend.api";
import {
    UserSharedExpense,
    SharedExpenseFriend,
    useSharedExpensesQuery,
} from "@/api/shared-expense.api";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";

const FriendSection = ({
    title,
    children,
    className,
}: {
    title: string;
    children: ReactNode;
    className?: string;
}) => (
    <div>
        <h1 className="text-center">{title}</h1>
        <div className={cn("space-y-2 mt-2", className)}>{children}</div>
    </div>
);

const CurrentFriends = () => {
    const { data: friends, isLoading } = useFriendsQuery();

    if (isLoading) {
        return <Loader className="animate-spin" />;
    }

    if (!friends) return <div>No friends</div>;

    return (
        <FriendSection
            title="Current Friends"
            className="rounded-lg shadow-2xl border-2 border-gray-300 p-1"
        >
            {friends.map((friend) => (
                <div>
                    <div className="flex items-center justify-between space-x-4">
                        <div className="flex items-center space-x-4">
                            <FriendItem key={friend._id} friend={friend} />
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button
                                size="sm"
                                variant="destructive"
                                className="w-full"
                            >
                                <UserRoundMinus
                                    size="16"
                                    className="text-red-300"
                                />
                            </Button>
                        </div>
                    </div>
                    <Separator className="mt-4 bg-slate-300" />
                </div>
            ))}
        </FriendSection>
    );
};

const FriendRequests = () => {
    const { data: friendRequests, isLoading } = useFriendRequestsQuery();
    const { mutate: acceptFriendRequest } = useAcceptFriendRequestMutation();
    const { mutate: rejectFriendRequest } = useRejectFriendRequestMutation();

    if (isLoading) {
        return <Loader className="animate-spin" />;
    }

    if (!friendRequests) return <div>No friend requests</div>;

    return (
        <FriendSection title="Friend Requests">
            {friendRequests.map((request) => (
                <div
                    key={request._id}
                    className="flex-col p-2 rounded-lg shadow-2xl border-2 border-gray-300"
                >
                    <FriendItem friend={request.sender} />
                    <div className="flex flex-row">
                        <Button
                            size="sm"
                            className="mr-1 w-full"
                            onClick={() => acceptFriendRequest(request._id)}
                        >
                            <UserRoundCheck
                                size="16"
                                className="text-green-500"
                            />
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            className="w-full"
                            onClick={() => rejectFriendRequest(request._id)}
                        >
                            <UserRoundX size="16" className="text-red-300" />
                        </Button>
                    </div>
                </div>
            ))}
        </FriendSection>
    );
};

const SearchFriends = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [query, setQuery] = useState<string | null>(null);
    const [friend, setFriend] = useState<FindFriend | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [isFriendAdded, setIsFriendAdded] = useState<boolean>(false);
    const { mutate: createFriendRequest } = useCreateFriendRequestMutation();

    useEffect(() => {
        if (query) {
            setIsLoading(true);
            setFriend(null);
            setIsError(false);
            setIsFriendAdded(false);
            findFriend(query)
                .then((friend) => {
                    setFriend(friend);
                    setIsLoading(false);
                    friend.isFriendRequestSent && setIsFriendAdded(true);
                })
                .catch(() => {
                    setIsError(true);
                    setIsLoading(false);
                });
        }
    }, [query]);

    const handleSearch = () => {
        setQuery(searchTerm);
    };

    const handleAddFriend = () => {
        const username = friend?.username;
        if (!username) return;
        console.log("Adding friend", username);
        createFriendRequest(username);
        setIsFriendAdded(true);
    };

    return (
        <FriendSection title="Find Friends">
            <div className="grid grid-cols-4 gap-4">
                <Input
                    className="col-span-3 shadow-2xl "
                    placeholder="Search for friends"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSearch();
                        }
                    }}
                />
                <Button
                    className="col-span-1 bg-blue-500 hover:bg-blue-600"
                    onClick={handleSearch}
                >
                    <UserRoundSearch size="24" className="text-green-400" />
                </Button>
            </div>
            {friend && (
                <div className="flex flex-col p-2 rounded-lg shadow-2xl border-2 border-gray-300">
                    <FriendItem
                        friend={{ username: friend.username, _id: friend._id }}
                    />
                    {!isFriendAdded ? (
                        <Button
                            size="sm"
                            variant={"default"}
                            onClick={handleAddFriend}
                            className="w-full mt-2"
                        >
                            <UserRoundPlus
                                size="16"
                                className="text-green-500"
                            />
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            variant={"default"}
                            className="w-full mt-2"
                            disabled={true}
                        >
                            <Check size="30" className="text-green-500" />
                        </Button>
                    )}
                </div>
            )}
            {isLoading && (
                <div className="flex flex-col justify-center items-center p-2 rounded-lg shadow-2xl border-2 border-gray-300">
                    <Loader className="animate-spin" />
                </div>
            )}
            {isError && (
                <div className="flex flex-col justify-center items-center p-2 rounded-lg shadow-2xl border-2 border-gray-300">
                    <p>User not found</p>
                </div>
            )}
        </FriendSection>
    );
};

const Friends = () => {
    return (
        <div className="grid grid-cols-3 gap-4">
            <CurrentFriends />
            <FriendRequests />
            <SearchFriends />
        </div>
    );
};

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
                        {sharedExpense.sharedExpense.name}
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
                        Copy
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
                                        <SelectTrigger className="ml-auto w-[110px]">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="notify">
                                                Notify me
                                            </SelectItem>
                                            <SelectItem value="do-not-notify">
                                                Do not notify me
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
                                                    Notify me
                                                </SelectItem>
                                                <SelectItem value="do-not-notify">
                                                    Do not notify me
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
                    <TabsTrigger value="friends">
                        <span className="mr-2">
                            <User className="h-4 w-4" />
                        </span>
                        Friends
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="shared-payments">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between space-x-4">
                                <CardTitle>Group Payment Manager</CardTitle>
                                <Button variant="outline">
                                    <CalendarDays className="h-4 w-4 mr-1" />
                                    View On Calendar
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <SharedExpensesContent />
                        </CardContent>
                        <CardFooter>{/* <Logo /> */}</CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="friends">
                    <Card className="min-h-80">
                        <CardContent className="space-y-2">
                            <Friends />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default SharedExpenses;

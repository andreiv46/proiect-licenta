import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import {
    Check,
    UserRoundX,
    UserRoundCheck,
    UserRoundPlus,
    Loader,
    UserRoundSearch,
    UserRoundMinus,
    Search,
    Bot,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FriendItem } from "@/components/UserItem";
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
import { cn } from "@/lib/utils";

const FriendSection = ({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) => <div className={cn("space-y-2 mt-2", className)}>{children}</div>;

const CurrentFriends = () => {
    const { data: friends, isLoading } = useFriendsQuery();

    if (isLoading) {
        return <Loader className="animate-spin" />;
    }

    if (!friends) return <div>No friends</div>;

    return (
        <div className="flex flex-col">
            <h2 className="text-2xl font-semibold">Friends</h2>
            <h3 className="text-sm text-muted-foreground">
                {friends.length} friends
            </h3>
            <FriendSection className="grid grid-cols-1 gap-3 mt-3">
                {friends.map((friend) => (
                    <div className="flex items-center justify-between space-x-4 border-2 bg-white rounded-xl">
                        <div className="flex items-center space-x-4">
                            <FriendItem key={friend._id} friend={friend} />
                        </div>
                        <div className="flex items-center space-x-4 pr-4">
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
                ))}
            </FriendSection>
        </div>
    );
};

const FriendRequests = () => {
    const { data: friendRequests, isLoading } = useFriendRequestsQuery();
    const { mutate: acceptFriendRequest } = useAcceptFriendRequestMutation();
    const { mutate: rejectFriendRequest } = useRejectFriendRequestMutation();

    if (isLoading) {
        return <Loader className="animate-spin" />;
    }

    if (!friendRequests) return <div></div>;

    return (
        <div className="flex flex-col">
            <h2 className="text-2xl font-semibold">Friend Requests</h2>
            <h3 className="text-sm text-muted-foreground">
                {friendRequests.length} friend requests
            </h3>
            <FriendSection>
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
                                <UserRoundX
                                    size="16"
                                    className="text-red-300"
                                />
                            </Button>
                        </div>
                    </div>
                ))}
            </FriendSection>
        </div>
    );
};

const FriendSearchStatus = ({
    isLoading,
    isError,
    defaultMessage,
}: {
    isLoading: boolean;
    isError: boolean;
    defaultMessage: string;
}) => {
    let content;
    if (isLoading) {
        content = <Loader className="animate-spin" />;
    } else if (isError) {
        content = (
            <div className="flex opacity-50">
                <p>User not found</p> <Bot className="ml-1" />
            </div>
        );
    } else {
        content = (
            <div className="flex opacity-50">
                <p>{defaultMessage}</p> <Search className="ml-1" />
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-center min-h-[120px] items-center p-2 ">
            {content}
        </div>
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
        <FriendSection>
            <div className="grid grid-cols-4 gap-2">
                <Input
                    className="col-span-3 shadow-2xl bg-white mb-1"
                    placeholder="Search..."
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
                    className="col-span-1 bg-blue-400 hover:bg-blue-500"
                    onClick={handleSearch}
                >
                    <UserRoundSearch size="24" className="text-green-300" />
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
            {!friend && (
                <FriendSearchStatus
                    isLoading={isLoading}
                    isError={isError}
                    defaultMessage="Find new friends"
                />
            )}
        </FriendSection>
    );
};

const Friends = () => {
    return (
        <div className="grid grid-cols-2 gap-4 mt-3">
            <SearchFriends />
            <div className="flex flex-col space-y-5">
                <FriendRequests />
                <CurrentFriends />
            </div>
        </div>
    );
};

const Profile = () => {
    return (
        <div className="flex justify-center mt-2">
            <Tabs defaultValue="user-profile" className="w-3/4">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="user-profile">
                        <span className="mr-2">
                            {/* <Handshake className="h-4 w-4" /> */}
                        </span>
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="friends">
                        <span className="mr-2">
                            {/* <User className="h-4 w-4" /> */}
                        </span>
                        Friends
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="user-profile">
                    <Card>
                        <CardHeader></CardHeader>
                        <CardContent className="space-y-2">
                            {/* <SharedExpensesContent /> */}
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

export default Profile;

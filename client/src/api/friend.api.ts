import { useQuery, UseQueryResult, useMutation } from "react-query";
import axios, { AxiosResponse } from "axios";
import { useQueryClient } from "react-query";

export interface Friend {
    username: string;
    _id: string;
}

export interface FindFriend extends Friend {
    isFriendRequestSent: boolean;
}

export interface FriendRequest {
    _id: string;
    sender: Friend;
    recipient: string;
    status: "pending" | "accepted" | "rejected";
    createdAt: Date;
}

const getFriends = async (): Promise<Friend[]> => {
    return axios
        .get("/friend/")
        .then((response: AxiosResponse<Friend[]>) => response.data);
};

export const useFriendsQuery = (): UseQueryResult<Friend[], unknown> => {
    return useQuery({
        queryKey: "friends",
        queryFn: getFriends,
        staleTime: 1000 * 60 * 5,
    });
};

export const findFriend = async (username: string): Promise<FindFriend> => {
    return axios
        .get(`/friend/find?username=${username}`)
        .then((response: AxiosResponse<FindFriend>) => response.data);
};

const getFriendRequests = async (): Promise<FriendRequest[]> => {
    return axios
        .get("/friend/requests")
        .then((response: AxiosResponse<FriendRequest[]>) => response.data);
};

export const useFriendRequestsQuery = (): UseQueryResult<
    FriendRequest[],
    unknown
> => {
    return useQuery({
        queryKey: "friendRequests",
        queryFn: getFriendRequests,
    });
};

const createFriendRequest = async (username: string): Promise<void> => {
    return axios.post(`/friend/add?username=${username}`);
};

export const useCreateFriendRequestMutation = () => {
    return useMutation(createFriendRequest);
};

const acceptFriendRequest = async (requestId: string): Promise<void> => {
    return axios.patch(`/friend/requests/${requestId}/accept`);
};

export const useAcceptFriendRequestMutation = () => {
    const queryClient = useQueryClient();
    return useMutation(acceptFriendRequest, {
        onSuccess: () => {
            queryClient.invalidateQueries("friends");
            queryClient.invalidateQueries("friendRequests");
        },
    });
};

const rejectFriendRequest = async (requestId: string): Promise<void> => {
    return axios.patch(`/friend/requests/${requestId}/reject`);
};

export const useRejectFriendRequestMutation = () => {
    const queryClient = useQueryClient();
    return useMutation(rejectFriendRequest, {
        onSuccess: () => {
            queryClient.invalidateQueries("friendRequests");
        },
    });
};

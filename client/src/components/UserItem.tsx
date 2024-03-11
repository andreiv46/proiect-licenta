import { User } from "@/contexts/auth.context";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const UserItem: React.FC<{ user: User }> = ({ user }) => {
    return (
        <div className="flex items-center justify-between gap-2 border rounded-[8px] p-2">
            <Avatar>
                <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="grow">
                <p className="text-[16px] font-bold">{user.username}</p>
                <p className="text-[12px] text-neutral-500">{user.email}</p>
            </div>
        </div>
    );
};

export default UserItem;

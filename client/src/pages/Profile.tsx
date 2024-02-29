import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate();

    return (
        <div>
            <Button onClick={() => navigate("/")}>Go to Home</Button>
            <h1>Profile</h1>
        </div>
    );
};
export default Profile;

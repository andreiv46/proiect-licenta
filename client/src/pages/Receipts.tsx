import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Receipts = () => {
    return (
        <div className="flex justify-center mt-2">
            <Tabs defaultValue="receipts" className="w-3/4">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="view-receipts">Receipts</TabsTrigger>
                    <TabsTrigger value="upload-receipt">Password</TabsTrigger>
                </TabsList>
                <TabsContent value="view-receipts">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your receipts</CardTitle>
                            <CardDescription>lalalalala</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>test</div>
                        </CardContent>
                        <CardFooter>
                            <Button>Save changes</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="password">
                    <Card>
                        <CardHeader>
                            <CardTitle>Password</CardTitle>
                            <CardDescription>
                                Change your password here. After saving, you'll
                                be logged out.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="current">
                                    Current password
                                </Label>
                                <Input id="current" type="password" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="new">New password</Label>
                                <Input id="new" type="password" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>Save password</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Receipts;

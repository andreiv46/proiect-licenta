import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { queryClient } from "./api/configureQueryClient";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import { Toaster } from "./components/ui/toaster";
import { configureAxios } from "./api/configureAxios";
import { AuthProvider } from "./contexts/auth.context";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./pages/ProtectedRoute";

configureAxios();

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <BrowserRouter>
                    <NavBar />
                    <Routes>
                        <Route path="/" element={<div>hey</div>} />
                        <Route element={<ProtectedRoute />}>
                            <Route path="/home" element={<Home />} />
                            <Route path="/profile" element={<Profile />} />
                        </Route>
                        <Route path="/login" element={<Login />} />
                        <Route path="*">"Not found"</Route>
                    </Routes>
                    <Toaster />
                    <ReactQueryDevtools
                        initialIsOpen={false}
                        position="bottom-right"
                    />
                </BrowserRouter>
            </AuthProvider>
        </QueryClientProvider>
    );
};

export default App;

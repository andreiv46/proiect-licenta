import axios from "axios";

const token = import.meta.env.VITE_SAMPLE_TOKEN;

export const configureAxios = () => {
    axios.defaults.baseURL = import.meta.env.VITE_API_URL;
    axios.defaults.headers.common["Content-Type"] = "application/json";
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

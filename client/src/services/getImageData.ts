import { API_ROUTES } from "@/lib/apiRoutes";
import axios from "axios";

const API = import.meta.env.VITE_API_ROUTE;

export const getImageData = async (frontImage: string | null, backImage: string | null) => {
    try {
        const response = await axios.post(`${API}${API_ROUTES.PARSE_AADHAR}`, {
            frontImage,
            backImage
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error; 
    }
};

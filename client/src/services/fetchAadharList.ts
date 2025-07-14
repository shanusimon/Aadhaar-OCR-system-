import axios from "axios";

const API = import.meta.env.VITE_API_ROUTE;

export const fetchAadharList = async()=>{
    try {
        const url = `${API}/aadhar-list`
        const response = await axios.get(url);
        return response.data
    } catch (error) {
        console.error(error);
    }
}
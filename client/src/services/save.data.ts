import axios from "axios";
import type { AadharData } from "@/types/aadhar-data.types";

const API = import.meta.env.VITE_API_ROUTE;

export const saveData = async (data: AadharData) => {
  try {
    const url = `${API}/save-data`;
    const respone = await axios.post(url, { data });
    return respone.data;
  } catch (error: any) {
    console.error(error);
  }
};

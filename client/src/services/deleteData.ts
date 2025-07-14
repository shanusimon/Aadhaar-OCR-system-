import axios from "axios"

const API = import.meta.env.VITE_API_ROUTE;

export const deleteData = async(id:string)=>{
    try {
        const url = `${API}/delete-data`
        const response = await axios.delete(url,{
            params:{
                id
            }
        })
        return response.data
    } catch (error) {
        console.error(error);
    }
}
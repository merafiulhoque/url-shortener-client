import { API_URLS } from "@/constants";
import { getToken } from "./getToken";

export async function getBulkJobs(){
    try {
        const token = await getToken()
        if(!token){
            return {
                success: false,
                message: "Unauthorized"
            }
        }

        const res = await fetch(
            API_URLS.GET_BULK_JOBS,{
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        const resData = await res.json()
        return resData
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Something went wrong"
        }
    }
}
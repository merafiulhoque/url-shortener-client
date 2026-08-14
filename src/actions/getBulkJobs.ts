import { API_URLS } from "@/constants";
import { getToken } from "./getToken";
import { RES_UNAUTHORIZED } from "@/constants/HttpResponseConstants";

export async function getBulkJobs(){
    try {
        const token = await getToken()
        if(!token){
            return RES_UNAUTHORIZED
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
        console.log(resData)
        return resData
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Something went wrong"
        }
    }
}
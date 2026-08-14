import { ErrorResponse, RES_UNAUTHORIZED } from "@/constants/HttpResponseConstants";
import { getToken } from "./getToken";
import { API_URLS } from "@/constants";
import { ApiResponse } from "@/types";

export async function deleteJob(id: string | number){
    try {
        const token = await getToken()

        if(!token){
            return RES_UNAUTHORIZED
        }

        const res = await fetch(
            `${API_URLS.DELETE_JOB_DETAIL}/${id}`,
            {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
        )
        const response: ApiResponse<null> = await res.json()
        return response
    } catch (error) {
        return ErrorResponse(error)
    }

}
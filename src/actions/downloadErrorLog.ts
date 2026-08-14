import { ErrorResponse, RES_UNAUTHORIZED } from "@/constants/HttpResponseConstants";
import { getToken } from "./getToken";
import { API_URLS } from "@/constants";
import { ApiResponse, DOWNLOAD_ERROR_LOG } from "@/types";

export async function downloadErrorLog(id: string  | number): Promise<DOWNLOAD_ERROR_LOG | ApiResponse<null>>{
    try {
        const token = await getToken()

        if(!token) return RES_UNAUTHORIZED

        const res = await fetch(
            `${API_URLS.DOWNLOAD_ERR_LOG}/${id}`,{
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        const arrayBuffer = await res.arrayBuffer()
        
        return {
            success: true,
            message: "Error log found",
            data: Buffer.from(arrayBuffer).toString("base64"),
            fileName: `error_log_${id}.txt`,
            contentType: res.headers.get("Content-type") ?? "text/plain"
        }

    } catch (error) {
        return ErrorResponse(error)
    }
}
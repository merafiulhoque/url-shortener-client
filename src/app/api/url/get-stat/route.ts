import { getToken } from "@/actions/getToken";
import { API_URLS } from "@/constants";
import { ApiResponse } from "@/types";
import { createResponse, createResponseWithData, forwardResponse } from "@/utils/globalUtilites/createResponse";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest){
    try {
        const { id }: {id: number} = await req.json()
        const token = await getToken()
        if (!token){
            return createResponse({
                success: false,
                message: "Unauthorized",
                status: 401
            })
        }
        const res = await fetch(API_URLS.GET_STAT, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json"
            },
            body: JSON.stringify({ id })
        })
        const resData: ApiResponse<any> = await res.json()
        return forwardResponse(resData)
    } catch (error) {
        
    }
}
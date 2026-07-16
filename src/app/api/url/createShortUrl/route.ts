import { getToken } from "@/actions/getToken";
import { API_URLS } from "@/constants";
import { ApiResponse, URLS } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST (req: NextRequest){
    try {
        const { originalUrl } = await req.json()
        const token = await getToken()
        if(!token){
            return NextResponse.json({
                success: false,
                message: "Unauthorized"
            }, {status: 401})
        }
        const ApiResponse = await fetch(API_URLS.CREATE_NEW_SHORT_URL, {
            method: "POST",
            headers: { 
                "Content-type": "application/json",
                Authorization:  `Bearer ${token}` },
            body: JSON.stringify({ originalUrl })
        })
        const resData: ApiResponse<URLS> = await ApiResponse.json()
        return NextResponse.json(resData, {status: resData.success ? 200 : 503})
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error instanceof Error ? error.message: "Something Went Wrong"
        })
    }
}
import { getToken } from "@/actions/getToken";
import { API_URLS } from "@/constants";
import { ApiResponse, URLS } from "@/types";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try {
        const token =await getToken()
        if(!token){
            return NextResponse.json({
                success: false,
                message: "Unauthorized"
            }, {status: 401})
        }
        const response = await fetch (API_URLS.GET_ALL_SHORT_URLS, {
            method: "GET", 
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const backendRes: ApiResponse<URLS[]> = await response.json()
        return NextResponse.json(backendRes, {status: 200})

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message
        })
    }
}
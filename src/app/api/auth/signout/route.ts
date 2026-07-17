import { getToken } from "@/actions/getToken";
import { API_URLS } from "@/constants";
import { ApiResponse } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try {
        const token = await getToken()
        if(!token){
            return NextResponse.json({
                success: false,
                message: "Unauthorized"
            })
        }
        // Call your logout endpoint
        const res = await fetch(API_URLS.LOGOUT, { 
            method: "POST", 
            credentials: "include", 
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const resData : ApiResponse<null> = await res.json()
        const response = NextResponse.json(resData, {status: res.status})
        // Redirect to signin page
        if (!res.ok || !resData.success) {
            return response
        }
        response.cookies.delete("token")
        return response
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error instanceof Error ? error.message : "Something went wrong"
        })
    }
}
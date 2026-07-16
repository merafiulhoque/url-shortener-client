import { getToken } from "@/actions/getToken";
import { API_URLS } from "@/constants";
import { ApiResponse, JWT_PAYLOAD, UserInfo } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET (req: NextRequest){
    try {
        const token = await getToken()
        if(!token){
            return NextResponse.json({
                success: false,
                message: "Unauthorized"
            }, {status: 401})
        }
        const response = await fetch(API_URLS.GET_USER, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const resdata: ApiResponse<JWT_PAYLOAD> = await response.json()
        if(!response.ok || !resdata.success || !resdata.data){
            return NextResponse.json({
                success: false,
                message: "Unauthorized"
            }, {status: 401})
        }
        return NextResponse.json(resdata)
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error instanceof Error ? error.message : "Something Went Wrong"
        }, {status: 500})
    }
}
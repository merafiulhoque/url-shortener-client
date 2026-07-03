import { getToken } from "@/actions/getToken";
import { API_URLS } from "@/constants";
import { ApiResponse, JWT_PAYLOAD, UserInfo } from "@/types";
import { cookies } from "next/headers";
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
        const resdata: ApiResponse<JWT_PAYLOAD | null> = await response.json()
        if(!resdata.success || !resdata.data){
            return NextResponse.json({
                success: false,
                message: "Unauthorized"
            }, {status: 401})
        }
        return NextResponse.json(resdata)
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, {status: 500})
    }
}
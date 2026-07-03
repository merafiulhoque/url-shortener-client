import { API_URLS } from "@/constants";
import { ApiResponse, LoginData } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const LoginData: LoginData = await req.json()
        const response = await fetch(API_URLS.SIGNIN, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(LoginData),
        });
        const responseData: ApiResponse<string> = await response.json()
        const res = NextResponse.json({
            success: responseData.success,
            message: responseData.message
        })
        if(!responseData.success || !responseData.data) {
            return res
        }
        res.cookies.set("token", responseData.data, {
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            maxAge: 3600,
            path: "/"
        })
        return res
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message
        })
    }
}
import { API_URLS } from "@/constants";
import { LoginData, LoginResponseData } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const loginData: LoginData = await req.json()
        const response = await fetch(API_URLS.SIGNIN, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loginData),
        });
        const {token, ...responseData}: LoginResponseData = await response.json()
        const res  = NextResponse.json(responseData, {status: response.status})
        if(!response.ok || !responseData.success || !token || !responseData.user) {
            return res
        }
        res.cookies.set("token", token, {
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            maxAge: 60*60,
            path: "/",
            priority: "high"
        })
        return res
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error instanceof Error ? error.message : "Something went wrong"
        }, { status: 500 })
    }
}
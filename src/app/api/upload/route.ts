import { getToken } from "@/actions/getToken";
import { API_URLS } from "@/constants";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try {
        const token = await getToken()
        const formData = await req.formData()

        const res = await fetch(API_URLS.UPLOAD_PIC, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData,
        });

        const resData = await res.json()
        return NextResponse.json(resData, {status: res.status})
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error instanceof Error ? error.message : "Something Went Wrong"
        }, {status: 500})
    }
}
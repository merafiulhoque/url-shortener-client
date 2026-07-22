import { getToken } from "@/actions/getToken";
import { API_URLS } from "@/constants";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try {
        const { amount }: {amount: number} = await req.json()
        
        if(!amount){
            return NextResponse.json({
                success: false,
                message: "Amount is required"
            }, {status: 400})
        }
        const token = await getToken()
        if(!token){
            return NextResponse.json({
                success: false,
                message: "Unauthorized"
            }, {status: 401})
        }

        const res = await fetch(API_URLS.CREATE_PAYMENT_ORDER, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json"
            },
            body: JSON.stringify({amount})
        })

        return NextResponse.json(await res.json(), {status: res.status})

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error instanceof Error ? error.message : "Something Went Wrong"
        })
    }
}
import { getToken } from "@/actions/getToken";
import { API_URLS } from "@/constants";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()
        if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature){
            return NextResponse.json({
                success: false,
                message: "No credentials got to verify the signature"
            }, {status: 400})
        }
        const token = await getToken()
        if(!token){
            return NextResponse.json({
                success: false,
                message: "Unauthorized"
            }, {status: 403})
        }
        const res = await fetch(API_URLS.VERIFY_PAYMENT, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json"
            },
            body: JSON.stringify({ razorpay_order_id, razorpay_payment_id, razorpay_signature })
        })
        return NextResponse.json(await res.json(), {status: res.status})
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error instanceof Error ? error.message : "Something Went Wrong"
        })
    }
}
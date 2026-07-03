import { getToken } from "@/actions/getToken";
import { API_URLS } from "@/constants";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest){
    try {
        const {id} = await req.json()
        if(!id){
            return NextResponse.json({
                success: false, message: "Invalid Request"
            }, {status: 400})
        }
        const token = await getToken()
        if(!token){
            return NextResponse.json({
                success: false, message: "Unauthorized"
            }, {status: 401})
        }
        const ApiResponse = await fetch(API_URLS.DELETE_SHORT_URL, {
            method: "DELETE",
            headers: { 
                "content-type": "application/json",
                Authorization: `Bearer ${token}`},
            body: JSON.stringify({id})
        })
        const resData = await ApiResponse.json()
        return NextResponse.json(resData, {status: resData.success ? 202 : 400})
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message
        })
    }
}
import { getToken } from "@/actions/getToken";
import { API_URLS } from "@/constants";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest){
    try {
        const {id, publicId} = await req.json()
        const token = await getToken()
        const res = await fetch(API_URLS.DELETE_PIC, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json"
            },
            body: JSON.stringify({id, publicId})
        })
        return NextResponse.json((await res.json()), {status: res.status})
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error instanceof Error ? error.message : "Something Went Wrong"
        }, {status: 500})
    }
}
import { ApiResponse, CreateResponse, CreateResponseWithData } from "@/types";
import { NextResponse } from "next/server";

export function createResponse(res: CreateResponse) : NextResponse<Omit<CreateResponse, "status">>{
    const response = NextResponse.json({
        success: res.success,
        message: res.message,
    }, {status: res.status})
    return response
}

export function createResponseWithData(res: CreateResponseWithData<any>){
    const response = NextResponse.json({
        success: res.success,
        message: res.message,
        data: res.data
    }, {status: res.status})
}

export function forwardResponse(res: ApiResponse<any>){
    return NextResponse.json(res)
}
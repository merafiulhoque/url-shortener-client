"use server"

import { API_URLS } from "@/constants";
import { ApiResponse } from "@/types";
import { getToken } from "./getToken";

export async function uploadTxtFile(file: File): Promise<ApiResponse<null>>{
    try {
        const token = await getToken()
        if(!token){
            return {
                success: false,
                message: "Unauthorized"
            }
        }
        if(!file) throw new Error("No file uploaded")


        const formData = new FormData()
        formData.append("text", file)

        const res = await fetch(API_URLS.ASSIGN_BULK_JOB, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        })
        const response: ApiResponse<null> = await res.json()
        return response
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Something went wrong"
        }
    }
}
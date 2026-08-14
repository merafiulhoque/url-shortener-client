"use server"

import { API_URLS } from "@/constants"
import { getToken } from "./getToken"
import { ApiResponse, BULK_JOB } from "@/types"
import { RES_UNAUTHORIZED } from "@/constants/HttpResponseConstants"

export async function getJobDetail(id: string | number){
    try {
        const token = await getToken()

        if(!token){
            return RES_UNAUTHORIZED
        }

        const res = await fetch(
            `${API_URLS.GET_JOB_DETAIL}/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
,                   Authorization: `Bearer ${token}`
                }
            }
        )
        const response: ApiResponse<BULK_JOB> = await res.json()
        return response

    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Something went wrong"
        }
    }
}
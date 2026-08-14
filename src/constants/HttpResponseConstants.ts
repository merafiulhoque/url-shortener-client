import { ApiResponse } from "@/types"

export const RES_UNAUTHORIZED = {
    success: false,
    message: "Unauthorized"
} as const

export function ErrorResponse(err: unknown){
    return {
        success: false,
        message: err instanceof Error ? err.message : "Something went wrong"
    }
}

export function ResponseWithData<T>(message: string, data: T): ApiResponse<T>{
    return {
        success: true,
        message: message,
        data: data
    }
}
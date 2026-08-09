import { getToken } from "@/actions/getToken";
import { API_URLS } from "@/constants";
import { ApiResponse, URLS } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const token = await getToken();

        if (!token) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized"
            }, { status: 401 });
        }

        const { 
            originalUrl, 
            customAlias, 
            password, // Extract password from request
            expiryDuration, 
            expiryUnit, 
            expiryDate 
        } = body;

        let expiresAt: string | null = null;

        // Calculate exact expiration date
        if (expiryDate) {
            expiresAt = new Date(expiryDate).toISOString();
        } else if (expiryDuration && expiryUnit) {
            const now = new Date();
            const duration = Number(expiryDuration);

            switch (expiryUnit) {
                case "minutes":
                    now.setMinutes(now.getMinutes() + duration);
                    break;
                case "hours":
                    now.setHours(now.getHours() + duration);
                    break;
                case "days":
                    now.setDate(now.getDate() + duration);
                    break;
                case "months":
                    now.setMonth(now.getMonth() + duration);
                    break;
            }
            expiresAt = now.toISOString();
        }

        // Bundle into final payload for the backend
        const finalPayload = {
            originalUrl,
            customAlias,
            password, // Pass password to main backend
            expiresAt,
        };

        const backendResponse = await fetch(API_URLS.CREATE_NEW_SHORT_URL, {
            method: "POST",
            headers: { 
                "Content-type": "application/json",
                Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify(finalPayload)
        });

        const resData: ApiResponse<URLS> = await backendResponse.json();
        
        return NextResponse.json(resData, { status: resData.success ? 200 : backendResponse.status || 503 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error instanceof Error ? error.message : "Something Went Wrong"
        }, { status: 500 });
    }
}
import { API_URLS } from "@/constants";
import { URLS } from "@/types";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest){
    try {
        const urls = await req.json()
        console.table(urls)
        const HEADERS = ["ID", "ORIGINAL URL", "SHORTENED URL", "USER"]
        const rows = urls.map( (url: URLS ) => [
            url.id,
            url.originalUrl,
            API_URLS.BASE_URL + "/" +url.shortnedUrl,
            url.userId
        ])
        const csv = [
            HEADERS.join(","),
            ...rows.map((row: Array<string | number>) =>
            row.map((value: string | number) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")
            ),
        ].join("\n");

        return new NextResponse(csv, {
            headers: {"Content-type": "text/csv","Content-Disposition": 'attachment; filename="urls.csv"'}
        })
        
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Error occurred"
        }, {status: 500})
    }
}
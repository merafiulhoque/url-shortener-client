
import { ApiResponse, URLS } from "@/types";
import { getToken } from "./getToken";
import { NextResponse } from "next/server";


export const fetchUrls = async (page: number) => {
      try {
        const token = await getToken()
        if(!token){
          throw new Error("Unauthorized")
        }
        const response = await fetch("/api/url/get-all-url",{
          method: "POST",
          credentials: "include",
          body: JSON.stringify({page})
        }

        );
        const result: ApiResponse<URLS[]> = await response.json();
        if (!response.ok || !result.success || !result.data) throw new Error(result.message || "Failed to load URLs.");
        return result.data
      } catch (err: any) {
        return null
      }
  };
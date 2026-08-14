
import { ApiResponse, URLS } from "@/types";
import { getToken } from "./getToken";
import { NextResponse } from "next/server";
import { RES_UNAUTHORIZED } from "@/constants/HttpResponseConstants";


export const fetchUrls = async (page: number) => {
      try {
        const token = await getToken()
        if(!token){
          return RES_UNAUTHORIZED
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

  export const fetchUrlsAll = async () => {
      try {
        const token = await getToken()
        if(!token){
          return RES_UNAUTHORIZED
        }
        const response = await fetch("/api/url/get-all-url",{
          method: "GET",
          credentials: "include"

        });
        const result: ApiResponse<URLS[]> = await response.json();
        if (!response.ok || !result.success || !result.data) throw new Error(result.message || "Failed to load URLs.");
        return result.data
      } catch (err: any) {
        return null
      }
  }
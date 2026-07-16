"use server"

import { ApiResponse, URLS } from "@/types";


export const fetchUrls = async () => {
      try {
        const response = await fetch("/api/url/get-all-url");
        const result: ApiResponse<URLS[]> = await response.json();
        if (!response.ok || !result.success || !result.data) throw new Error(result.message || "Failed to load URLs.");
        return result.data
      } catch (err: any) {
        return null
      }
  };
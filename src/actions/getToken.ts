"use server"

import { cookies } from "next/headers"

export async function getToken () {
    const token = (await cookies()).get("token")?.value
    return token
}
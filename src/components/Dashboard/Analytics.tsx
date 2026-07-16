"use client"

import { fetchUrls } from "@/actions/fetchUrls"
import { useURLStore } from "@/store/urlStore"
import { useEffect } from "react"
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export default function Analytics(){
    const { urls, hydrated, setUrls } = useURLStore()

    useEffect(() => {
        if (!hydrated) return
        if(urls && urls !== null){
            return
        }
        (async () => {
            const data = await fetchUrls()
            if(!data){
                setUrls([])
                return
            }
            setUrls(data)
        })();
    }, [urls, hydrated, setUrls])

    console.log("ANALYTICS:::",urls)
    return(
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={urls ?? []}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="originalUrl"/>
                <YAxis/>
                <Tooltip />
                <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#313131"
                />
                <Bar dataKey="clicks" fill="#3b82f6" />
            </BarChart>
        </ResponsiveContainer>
    )
}
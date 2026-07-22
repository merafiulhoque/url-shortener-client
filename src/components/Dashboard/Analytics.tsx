"use client"

import { fetchUrls } from "@/actions/fetchUrls"
import { useURLStore } from "@/store/urlStore"
import { useEffect } from "react"
import { 
    Bar, 
    ComposedChart, 
    CartesianGrid, 
    Line, 
    ResponsiveContainer, 
    Tooltip, 
    XAxis, 
    YAxis 
} from "recharts"
import { AlertCircle } from "lucide-react"

export default function Analytics() {
    const { urls, hydrated, setUrls } = useURLStore()

    useEffect(() => {
        if (!hydrated) return
        if (urls && urls !== null) {
            return
        }
        (async () => {
            const data = await fetchUrls()
            if (!data) {
                setUrls([])
                return
            }
            setUrls(data)
        })();
    }, [urls, hydrated, setUrls])

    return (
        <div className="w-full p-4 sm:p-8 space-y-8 animate-in fade-in duration-500">
            
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                    Analytics Overview
                </h1>
                <p className="text-sm text-zinc-400 mt-2">
                    Track your link performance, engagement, and revenue.
                </p>
            </div>

            {/* Chart Card */}
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl shadow-xl">
                <h3 className="text-lg font-semibold text-zinc-200 mb-6">Clicks by Link</h3>
                
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart 
                            data={urls ?? []} 
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                            <CartesianGrid 
                                strokeDasharray="3 3" 
                                stroke="#27272a" 
                                vertical={false} 
                            />
                            <XAxis 
                                dataKey="id" 
                                stroke="#71717a" 
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: '#71717a' }}
                                dy={10} // Adds a bit of padding between labels and the axis
                            />
                            <YAxis 
                                stroke="#71717a" 
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: '#71717a' }}
                            />
                            <Tooltip 
                                cursor={{ fill: '#27272a', opacity: 0.4 }}
                                contentStyle={{ 
                                    backgroundColor: '#18181b', // zinc-900
                                    borderColor: '#27272a', // zinc-800
                                    borderRadius: '12px',
                                    color: '#e4e4e7', // zinc-200
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                                }}
                                itemStyle={{ color: '#a1a1aa' }}
                            />
                            
                            {/* Revenue Line */}
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#22d3ee" // Cyan-400
                                strokeWidth={3}
                                dot={{ fill: '#22d3ee', r: 4, strokeWidth: 0 }}
                                activeDot={{ r: 6, stroke: '#18181b', strokeWidth: 2 }}
                            />
                            
                            {/* Clicks Bar */}
                            <Bar 
                                dataKey="clicks" 
                                fill="#6366f1" // Indigo-500
                                radius={[4, 4, 0, 0]} 
                                barSize={40}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Floating Warning Widget */}
            <div className="fixed bottom-6 right-6 z-40 max-w-sm bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 p-4 rounded-2xl shadow-2xl shadow-black/50 flex gap-3 items-start animate-in fade-in slide-in-from-bottom-5">
                <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                    <h4 className="text-sm font-semibold text-zinc-200 mb-1">Data Freshness</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                        This data may be cached. To see the absolute latest data, please sign out and sign in again. Thank you!
                    </p>
                </div>
            </div>

        </div>
    )
}
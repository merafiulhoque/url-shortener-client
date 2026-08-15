"use client"

import { fetchUrls, fetchUrlsAll } from "@/actions/fetchUrls"
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
import { AlertCircle, BarChart2 } from "lucide-react"

export default function Analytics() {
    const { urls, hydrated, setUrls } = useURLStore()

    useEffect(() => {
        if (!hydrated) return
        if (urls && urls !== null) {
            return
        }
        (async () => {
            const data = await fetchUrlsAll()
            if (!data) {
                setUrls([])
                return
            }
            setUrls(data)
        })();
    }, [urls, hydrated, setUrls])

    return (
        <div className="relative w-full h-full min-h-0 p-4 sm:p-8 space-y-8 animate-in fade-in duration-500 selection:bg-emerald-700/30 selection:text-emerald-200 z-0 overflow-y-auto custom-scrollbar">
            
            {/* Deep green ambient glows */}
            <div className="absolute top-0 left-1/4 w-[60%] max-w-2xl h-[300px] bg-emerald-700/[0.04] blur-[120px] rounded-full pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0a0a0a] border-2 border-emerald-700/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                    <BarChart2 className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                        Analytics <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Overview</span>
                    </h1>
                    <p className="text-[13px] sm:text-sm text-zinc-500 mt-1">
                        Track your link performance, engagement, and revenue.
                    </p>
                </div>
            </div>

            {/* Chart Card */}
            <div className="bg-[#09090A] border border-emerald-900/30 p-6 sm:p-8 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden z-10">
                
                {/* Subtle Green Grid Pattern inside the chart card */}
                <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#047857_1px,transparent_1px),linear-gradient(to_bottom,#047857_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-0"></div>

                <div className="relative z-10">
                    <h3 className="text-lg font-semibold text-zinc-200 mb-6 flex items-center gap-2">
                        Clicks by Link
                    </h3>
                    
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart 
                                data={urls ?? []} 
                                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                            >
                                <CartesianGrid 
                                    strokeDasharray="3 3" 
                                    stroke="rgba(255,255,255,0.05)" 
                                    vertical={false} 
                                />
                                <XAxis 
                                    dataKey="id" 
                                    stroke="#52525b" // zinc-600
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: '#71717a' }} // zinc-500
                                    dy={10} 
                                />
                                <YAxis 
                                    stroke="#52525b" 
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: '#71717a' }}
                                />
                                <Tooltip 
                                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                    contentStyle={{ 
                                        backgroundColor: '#09090A', 
                                        borderColor: 'rgba(16, 185, 129, 0.3)', // Emerald border
                                        borderRadius: '16px',
                                        color: '#e4e4e7',
                                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.8)'
                                    }}
                                    itemStyle={{ color: '#a1a1aa', fontSize: '13px' }}
                                    labelStyle={{ color: '#10b981', fontWeight: 'bold', marginBottom: '4px' }}
                                />
                                
                                {/* Revenue Line */}
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#34d399" // Emerald-400
                                    strokeWidth={3}
                                    dot={{ fill: '#34d399', r: 4, strokeWidth: 0 }}
                                    activeDot={{ r: 6, fill: '#34d399', stroke: '#000000', strokeWidth: 3 }}
                                />
                                
                                {/* Clicks Bar */}
                                <Bar 
                                    dataKey="clicks" 
                                    fill="#059669" // Emerald-600
                                    radius={[4, 4, 0, 0]} 
                                    barSize={40}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Floating Warning Widget */}
            <div className="fixed bottom-6 right-6 z-40 max-w-sm bg-[#0a0a0c]/95 backdrop-blur-xl border border-emerald-900/40 p-5 rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.9)] flex gap-3.5 items-start animate-in fade-in slide-in-from-bottom-5">
                <div className="p-2 bg-emerald-500/10 rounded-full border border-emerald-500/20 shrink-0">
                    <AlertCircle className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                    <h4 className="text-[14px] font-semibold text-zinc-200 mb-1.5">Data Freshness</h4>
                    <p className="text-[12px] text-zinc-400 leading-relaxed">
                        This data may be cached. To see the absolute latest data, please sign out and sign in again. Thank you!
                    </p>
                </div>
            </div>

        </div>
    )
}
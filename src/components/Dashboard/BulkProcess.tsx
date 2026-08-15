"use client"

import { useAuthStore } from "@/store/authStrore"
import { useEffect, useState } from "react"
import { useToast } from "../ui/Toast"
import { useMutation } from "@tanstack/react-query"
import { ApiResponse } from "@/types"
import { uploadTxtFile } from "@/actions/uploadTxtFile"
import { AlertTriangle, FileText, Loader2, UploadCloud } from "lucide-react"

export default function BulkProcess() {
    const [pageReady, setPageReady] = useState<boolean>(false)
    const [file, setFile] = useState<File | null>(null)
    
    const { user, hydrated } = useAuthStore()
    const { showToast } = useToast()

    useEffect(() => {    
        if (!hydrated) return
        if (!user) return
        setPageReady(hydrated && !!user)    
    }, [hydrated, user])

    async function handleFileUpload() {
        if (!file) throw new Error("No file selected")
        
        const resData = await uploadTxtFile(file)
        return resData
    
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = e.target.files?.[0]
        
        if (!selectedFile) {
            setFile(null)
            return
        }

        // Check file types accurately (some browsers use MIME types, some use extensions)
        const isTxt = selectedFile.type === "text/plain" || selectedFile.name.endsWith(".txt")
        const isCsv = selectedFile.type === "text/csv" || selectedFile.name.endsWith(".csv")

        // Role-based validation
        if (user?.isPremium) {
            if (!isTxt && !isCsv) {
                showToast({
                    text: "Invalid format, Only .txt are allowed",
                    bgColor: "red",
                    duration: 3000
                })
                e.target.value = "" // Reset input
                return
            }
        } else {
            if (!isTxt) {
                showToast({
                    text: "Invalid format. Only .txt files are allowed on the free plan.",
                    bgColor: "red",
                    duration: 3000
                })
                e.target.value = "" // Reset input
                return
            }
        }

        // Size validation (30KB)
        if (selectedFile.size > 30 * 1024) {
            showToast({
                text: "File must be under 30KB",
                bgColor: "red",
                duration: 3000
            })
            e.target.value = "" // Reset input
            return
        }
        
        setFile(selectedFile)
    }

    const mutation = useMutation({
        mutationFn: handleFileUpload,
        onSuccess: function (data: ApiResponse<null>) {
            showToast({
                text: data?.message ?? "File uploaded successfully, Processing...",
                bgColor: data?.success ? "green" : "red",
                duration: 3000
            })
            setTimeout(() => {
                window.location.reload()
            }, 1000);
            
        },
        onError: function(err: any) {
            showToast({
                text: err.message ?? "Something went wrong",
                bgColor: "red",
                duration: 2000
            })
        }
    })

    if (!pageReady) return null; // Prevents hydration mismatch

    // Dynamic attributes for the input
    // const acceptFormats = user?.isPremium ? ".txt,.csv,text/plain,text/csv" : ".txt,text/plain"
    const acceptFormats = ".txt,text/plain"
    
    // Check if the currently selected file is a TXT file (or if nothing is selected yet)
    const isTxtSelected = !file || file.type === "text/plain" || file.name.endsWith(".txt")

    return (
        <div className="relative w-full h-full min-h-0 p-4 sm:p-6 lg:p-8 flex flex-col items-center animate-in fade-in duration-500 overflow-y-auto custom-scrollbar bg-[#000000] selection:bg-emerald-700/30 selection:text-emerald-200 z-0">
            
            {/* Deep green ambient glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-3xl h-[400px] bg-emerald-700/[0.04] blur-[150px] rounded-full pointer-events-none z-0" />

            <div className="w-full max-w-2xl bg-[#09090A] border border-white/5 rounded-[24px] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] mt-6 sm:mt-10 relative overflow-hidden z-10">
                
                {/* Subtle Inner Pattern & Glow */}
                <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#047857_1px,transparent_1px),linear-gradient(to_bottom,#047857_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-0"></div>
                <div className="absolute top-0 right-0 w-[50%] h-[150px] bg-emerald-500/[0.03] blur-[60px] pointer-events-none z-0" />

                <div className="mb-8 text-center space-y-3 relative z-10">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#0a0a0a] border-2 border-emerald-700/50 shadow-[0_0_20px_rgba(16,185,129,0.15)] mb-2">
                        <UploadCloud className="w-6 h-6 text-emerald-500" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                        Bulk <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Upload</span>
                    </h1>
                    <p className="text-zinc-400 text-[13px] sm:text-sm font-medium">
                        {user?.isPremium 
                            ? "Upload your .txt file to shorten multiple URLs at once." 
                            : "Upload a .txt file to shorten multiple URLs. Upgrade to Premium for .csv support!"}
                    </p>
                </div>

                <div className="flex flex-col gap-6 w-full max-w-lg mx-auto relative z-10">
                    
                    {/* File Input styling */}
                    <div className="relative group p-1.5 rounded-xl bg-[#050505] border border-white/10 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all shadow-inner">
                        <input 
                            type="file" 
                            accept={acceptFormats}
                            onChange={handleFileChange}
                            disabled={mutation.isPending}
                            className="block w-full text-[13px] text-zinc-400
                                file:mr-4 file:py-2.5 file:px-4
                                file:rounded-lg file:border
                                file:text-[13px] file:font-semibold
                                file:bg-[#111113] file:text-emerald-500 file:border-white/5
                                hover:file:bg-emerald-500/10 hover:file:border-emerald-500/30 file:transition-all
                                disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed outline-none"
                        />
                    </div>

                    {/* Dynamic Notice for TXT files */}
                    {isTxtSelected && (
                        <div className="animate-in slide-in-from-top-2 fade-in duration-300 flex items-start gap-3 text-[13px] text-amber-500/90 bg-[#111113] border border-amber-900/30 px-4 py-3.5 rounded-xl shadow-inner">
                            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                            <p className="leading-relaxed">
                                <strong className="font-semibold text-amber-500">Notice:</strong> Only valid URLs separated by Enter (new line) are to be uploaded.
                            </p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        onClick={() => mutation.mutate()}
                        disabled={!file || mutation.isPending}
                        className="group relative w-full h-14 px-8 bg-gradient-to-b from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 disabled:from-[#111113] disabled:to-[#111113] disabled:border disabled:border-white/5 disabled:text-zinc-500 rounded-xl font-bold text-white shadow-[0_4px_15px_rgba(16,185,129,0.2)] disabled:shadow-none transition-all duration-300 hover:shadow-[0_6px_20px_rgba(16,185,129,0.3)] disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98] disabled:active:scale-100 overflow-hidden"
                    >
                        {!(!file || mutation.isPending) && (
                            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 z-0" />
                        )}
                        
                        <div className="relative z-10 flex items-center gap-2">
                            {mutation.isPending ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <FileText className="w-5 h-5" />
                                    <span>Upload & Process URLs</span>
                                </>
                            )}
                        </div>
                    </button>

                </div>
            </div>
        </div>
    )
}
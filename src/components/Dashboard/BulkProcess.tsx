"use client"

import { useAuthStore } from "@/store/authStrore"
import { useEffect, useState } from "react"
import { useToast } from "../ui/Toast"
import { useMutation } from "@tanstack/react-query"
import { ApiResponse } from "@/types"
import { uploadTxtFile } from "@/actions/uploadTxtFile"

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
        try {
            if (!file) throw new Error("No file selected")
            
            // Assuming uploadTxtFile handles both or you will branch this later
            const resData = await uploadTxtFile(file)
            return resData
        } catch (error) {
            throw error
        }
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
                    text: "Invalid format. Premium users can upload .txt or .csv",
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
        <div className="w-full p-4 flex flex-col items-center animate-in fade-in duration-500">
            <div className="w-full max-w-2xl bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl mt-10">
                
                <div className="mb-8 text-center space-y-2">
                    <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                        Bulk Upload
                    </h1>
                    <p className="text-zinc-400 text-sm">
                        {user?.isPremium 
                            ? "Upload your .txt  to shorten multiple URLs at once." 
                            : "Upload a .txt file to shorten multiple URLs. Upgrade to Premium for .csv support!"}
                    </p>
                </div>

                <div className="flex flex-col gap-6 w-full max-w-lg mx-auto">
                    
                    {/* File Input styling */}
                    <div className="relative group p-1 rounded-xl bg-zinc-950 border border-zinc-800 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                        <input 
                            type="file" 
                            accept={acceptFormats}
                            onChange={handleFileChange}
                            disabled={mutation.isPending}
                            className="block w-full text-sm text-zinc-400
                                file:mr-4 file:py-3 file:px-4
                                file:rounded-lg file:border-0
                                file:text-sm file:font-semibold
                                file:bg-zinc-900 file:text-indigo-400 file:border file:border-zinc-800
                                hover:file:bg-indigo-500/10 hover:file:border-indigo-500/30 file:transition-all
                                disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                        />
                    </div>

                    {/* Dynamic Notice for TXT files */}
                    {isTxtSelected && (
                        <div className="animate-in slide-in-from-top-2 fade-in duration-300 text-sm text-amber-500/90 bg-amber-500/10 border border-amber-500/20 px-4 py-3 rounded-xl">
                            <strong className="font-semibold">Notice:</strong> Only valid URLs separated by Enter (new line) are to be uploaded.
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        onClick={() => mutation.mutate()}
                        disabled={!file || mutation.isPending}
                        className="group relative px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:shadow-indigo-500/40 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {mutation.isPending ? "Processing..." : "Upload & Process URLs"}
                    </button>

                </div>
            </div>
        </div>
    )
}
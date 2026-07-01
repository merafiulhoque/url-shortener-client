"use client"

import CreateShortUrlPage from "@/components/Dashboard/CreateShortUrl"

// import { API_URLS } from "@/constants"
// import { ApiResponse } from "@/types"
// import { useRouter } from "next/navigation"
// import { useState } from "react"

// export default function page(){
//     const [newUrl, setNewUrl] = useState<string>("")
//     const [error, setError] = useState("")
//     const router = useRouter()

//     const handleShorten = async () => {
//         try {
//             const ApiResponse = await fetch(API_URLS.CREATE_NEW_SHORT_URL, {
//                 method: "POST",
//                 credentials: "include",
//                 headers: {"Content-type": "application/json"},
//                 body: JSON.stringify({originalUrl: newUrl})
//             })
//             const response: ApiResponse<null> =await ApiResponse.json()
//             if(!response.success){
//                 setError(response.message ?? "Failed to shorten URL")
//                 return
//             }
//             setError(response.message)
//             setTimeout(() => {
//                 setError("")
//                 router.replace("/dashboard")
//             }, 2000);
//         } catch (error) {
//             setError("Something Went Wrong")
//         }
//     }
//     return (
//         <div className="w-full h-full bg-zinc-400 p-10 flex">
//             Create your new shortened URL
//             <input 
//                 type="text" 
//                 placeholder="Enter your link to shorten"
//                 className=""    
//                 value={newUrl}
//                 onChange={e => setNewUrl(e.target.value)}
//             />
//             <button
//                 onClick={handleShorten}
//             >Shorten</button>

//             {
//                 error && (
//                     <div className="fixed bottom-20 right-20 bg-emerald-500">
//                         {error}
//                     </div>
//                 )
//             }
//         </div>
//     )
// }

export default function page(){
    return <CreateShortUrlPage />
}
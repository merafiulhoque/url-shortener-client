import { URLS } from "@/types"
import {create} from "zustand"
import {persist} from "zustand/middleware"


type URLStore = {
    urls: URLS[] | null
    hydrated: boolean
    setUrls: (urls: URLS[]) => void
    invalidate: () => void,
    removeUrl:(id: number) => void,
    addUrl: (url: URLS) => void
    setHydrated: (value: boolean) => void    
}

export const useURLStore = create<URLStore>()(
    persist(
        (set) => ({
            urls: null,
            hydrated: false,
            setUrls: (urls) => set({urls}),
            invalidate: () => set({urls: null}),
            removeUrl: (id) => {
                set(state => ({
                    urls: state.urls?.filter(u => u.id !== id) ?? null
                }))
            },
            addUrl: (url) => {
                set( state => ({
                    urls: state.urls ? [url, ...state.urls] : [url]
                }))
            },
            setHydrated: (value) => set({hydrated: true})
        }),
        {
            name: "url-store",
            onRehydrateStorage: () => state => {
                state?.setHydrated(true)
            }
        }
    )
)
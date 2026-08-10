import { fetchUrls } from "@/actions/fetchUrls"
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
    getUrls: (page: number) => Promise<void>
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
            setHydrated: (value) => set({hydrated: value}),
            getUrls: async (page) => {
                const urlsFetched = await fetchUrls(page)
                if(!urlsFetched){
                    set({urls: null})
                    return
                }
                set({urls: urlsFetched})
            }
        }),
        {
            name: "url-store",
            onRehydrateStorage: () => state => {
                state?.setHydrated(true)
            }
        }
    )
)
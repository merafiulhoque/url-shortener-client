import { JWT_PAYLOAD } from "@/types"
import { create } from "zustand"
import { persist } from "zustand/middleware"

type AuthStore = {
    user: JWT_PAYLOAD | null
    hydrated: boolean

    signin: (user: JWT_PAYLOAD) => void
    signout: () => void
    updateDp: (newUrl: string) => void
    setHydrated: (value: boolean) => void

}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            hydrated: false,
            signin: (user) => set({user}),
            signout: () => set({user: null}),
            updateDp: (newUrl) => {
                set(state => ({
                    user: state.user ? {...state.user, profilePic: newUrl} : null
                }))
            },
            setHydrated: (value) => set({hydrated: value})
        }),
        {
            name: "auth-storage",
            onRehydrateStorage: () => (state) => {
                state?.setHydrated(true)
            }
        }
    )
    
)
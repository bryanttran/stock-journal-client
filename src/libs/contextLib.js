import { useContext, createContext } from "react";

export const AppContext = createContext(null);

export function useAppContext() {
    const context = useContext(AppContext)
    if (!context)
        throw new Error('AppContext must be used with AppProvider!')
    return context
}
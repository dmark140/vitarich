'use client'
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { StoreState } from './GlobalContextStates';



export interface GlobalContextType {
    setValue: <K extends keyof StoreState>(key: K, value: StoreState[K]) => void;
    getValue: <K extends keyof StoreState>(key: K) => StoreState[K];
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);


export const GlobalProvider = ({ children }: { children: ReactNode }) => {
    // 1. Safe Initialization with a try-catch block
    const [store, setStore] = useState<StoreState>(() => {
        if (typeof window === 'undefined') return {};
        try {
            const stored = localStorage.getItem('app_store');
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.error("Failed to parse store from localStorage", error);
            return {};
        }
    });

    // 2. Sync with localStorage safely
    useEffect(() => {
        try {
            localStorage.setItem('app_store', JSON.stringify(store));
        } catch (error) {
            console.error("Failed to save to localStorage", error);
        }
    }, [store]);

    // 3. Use useCallback to prevent unnecessary re-renders in child components
    const setValue = useCallback(<K extends keyof StoreState>(key: K, value: StoreState[K]) => {
        setStore((prev) => ({ ...prev, [key]: value }));
    }, []);

    const getValue = useCallback(<K extends keyof StoreState>(key: K): StoreState[K] => {
        return store[key];
    }, [store]);

    return (
        <GlobalContext.Provider value={{ setValue, getValue }
        }>
            {children}
        </GlobalContext.Provider>
    );
};
export const useGlobalContext = () => {
    const context = useContext(GlobalContext);

    if (!context) {
        throw new Error('useGlobalContext must be used within a GlobalProvider');
    }

    return context;
};
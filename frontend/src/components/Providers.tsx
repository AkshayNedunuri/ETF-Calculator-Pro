"use client";

import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "./UI/Toast";
import { CurrencyProvider } from "@/context/CurrencyContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ToastProvider>
                <CurrencyProvider>
                    {children}
                </CurrencyProvider>
            </ToastProvider>
        </SessionProvider>
    );
}

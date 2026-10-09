"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { 
    CurrencyCode, 
    DEFAULT_USD_RATE, 
    getActiveCurrency, 
    getActiveExchangeRate, 
    formatCurrency as formatCurr, 
    formatCurrencyCompact as formatCurrCompact,
    getCurrencySymbol 
} from "@/utils/formatCurrency";

interface CurrencyContextType {
    currency: CurrencyCode;
    setCurrency: (c: CurrencyCode) => void;
    exchangeRate: number;
    setExchangeRate: (rate: number) => void;
    symbol: string;
    formatAmount: (amountInINR: number, options?: { compact?: boolean }) => string;
    convertAmount: (amountInINR: number) => number;
    toggleCurrency: () => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currency, setCurrencyState] = useState<CurrencyCode>("INR");
    const [exchangeRate, setExchangeRateState] = useState<number>(DEFAULT_USD_RATE);

    // Initial load from localStorage on client
    useEffect(() => {
        if (typeof window !== "undefined") {
            const initialCurrency = getActiveCurrency();
            const initialRate = getActiveExchangeRate();
            setCurrencyState(initialCurrency);
            setExchangeRateState(initialRate);

            const handleStorageChange = (e: StorageEvent) => {
                if (e.key === "wealthCalc_currency" && e.newValue) {
                    setCurrencyState(e.newValue as CurrencyCode);
                }
                if (e.key === "wealthCalc_usdRate" && e.newValue) {
                    const parsed = parseFloat(e.newValue);
                    if (!isNaN(parsed) && parsed > 0) setExchangeRateState(parsed);
                }
            };

            const handleCustomChange = (e: Event) => {
                const custom = e as CustomEvent<{ currency?: CurrencyCode; rate?: number }>;
                if (custom.detail?.currency) {
                    setCurrencyState(custom.detail.currency);
                }
                if (custom.detail?.rate) {
                    setExchangeRateState(custom.detail.rate);
                }
            };

            window.addEventListener("storage", handleStorageChange);
            window.addEventListener("wealthcalc_currency_change", handleCustomChange);

            return () => {
                window.removeEventListener("storage", handleStorageChange);
                window.removeEventListener("wealthcalc_currency_change", handleCustomChange);
            };
        }
    }, []);

    const setCurrency = useCallback((newCurrency: CurrencyCode) => {
        setCurrencyState(newCurrency);
        if (typeof window !== "undefined") {
            localStorage.setItem("wealthCalc_currency", newCurrency);
            window.dispatchEvent(
                new CustomEvent("wealthcalc_currency_change", {
                    detail: { currency: newCurrency, rate: exchangeRate },
                })
            );
        }
    }, [exchangeRate]);

    const setExchangeRate = useCallback((newRate: number) => {
        if (isNaN(newRate) || newRate <= 0) return;
        setExchangeRateState(newRate);
        if (typeof window !== "undefined") {
            localStorage.setItem("wealthCalc_usdRate", newRate.toString());
            window.dispatchEvent(
                new CustomEvent("wealthcalc_currency_change", {
                    detail: { currency, rate: newRate },
                })
            );
        }
    }, [currency]);

    const toggleCurrency = useCallback(() => {
        setCurrency(currency === "INR" ? "USD" : "INR");
    }, [currency, setCurrency]);

    const symbol = getCurrencySymbol(currency);

    const convertAmount = useCallback((amountInINR: number): number => {
        if (currency === "USD") {
            return amountInINR / exchangeRate;
        }
        return amountInINR;
    }, [currency, exchangeRate]);

    const formatAmount = useCallback((amountInINR: number, options?: { compact?: boolean }): string => {
        if (options?.compact) {
            return formatCurrCompact(amountInINR, currency, exchangeRate);
        }
        return formatCurr(amountInINR, currency, exchangeRate);
    }, [currency, exchangeRate]);

    return (
        <CurrencyContext.Provider
            value={{
                currency,
                setCurrency,
                exchangeRate,
                setExchangeRate,
                symbol,
                formatAmount,
                convertAmount,
                toggleCurrency,
            }}
        >
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = (): CurrencyContextType => {
    const context = useContext(CurrencyContext);
    if (!context) {
        // Fallback for components rendered outside provider
        const curr = getActiveCurrency();
        const rate = getActiveExchangeRate();
        return {
            currency: curr,
            setCurrency: () => {},
            exchangeRate: rate,
            setExchangeRate: () => {},
            symbol: getCurrencySymbol(curr),
            formatAmount: (amount, opts) => opts?.compact ? formatCurrCompact(amount, curr, rate) : formatCurr(amount, curr, rate),
            convertAmount: (amount) => curr === "USD" ? amount / rate : amount,
            toggleCurrency: () => {},
        };
    }
    return context;
};

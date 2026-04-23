import React, { createContext, useContext, useState, useEffect } from "react";

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState(localStorage.getItem("preferredCurrency") || "INR");

    const countries = [
        { name: "India", code: "IN", currency: "INR", symbol: "₹" },
        { name: "USA", code: "US", currency: "USD", symbol: "$" },
        { name: "UK", code: "GB", currency: "GBP", symbol: "£" },
        { name: "Europe", code: "EU", currency: "EUR", symbol: "€" },
        { name: "UAE", code: "AE", currency: "AED", symbol: "د.إ" },
    ];

    const [selectedCountry, setSelectedCountry] = useState(
        countries.find(c => c.currency === currency) || countries[0]
    );

    useEffect(() => {
        localStorage.setItem("preferredCurrency", currency);
    }, [currency]);

    const toggleCurrency = () => {
        setCurrency(prev => (prev === "INR" ? "USD" : "INR"));
    };

    const convertPrice = (price, from = "INR") => {
        const rate = 83.5; 
        if (from === "INR" && currency === "USD") return (price / rate).toFixed(2);
        if (from === "USD" && currency === "INR") return (price * rate).toFixed(0);
        return price;
    };

    const formatPrice = (price) => {
        if (currency === "USD") return `$${price}`;
        return `₹${price}`;
    };

    return (
        <CurrencyContext.Provider value={{ 
            currency, 
            setCurrency, 
            toggleCurrency, 
            convertPrice, 
            formatPrice,
            selectedCountry,
            setSelectedCountry,
            countries
        }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => useContext(CurrencyContext);

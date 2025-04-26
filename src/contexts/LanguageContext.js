import React, { createContext, useState, useContext, useEffect } from "react";
import he from "../locales/he";
import en from "../locales/en";
import ru from "../locales/ru";
import es from "../locales/es";
import config from "../config";

const LanguageContext = createContext();

const translations = {
    he,
    en,
    ru,
    es,
};

export const LanguageProvider = ({ children }) => {
    // Initialize with Hebrew as fallback, but immediately check for saved preference
    const [language, setLanguage] = useState("he");
    const [currentTranslations, setCurrentTranslations] = useState(he);

    // Load saved language preference on mount
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.language) {
            setLanguage(user.language);
            setCurrentTranslations(translations[user.language]);
        }
    }, []);

    const changeLanguage = async (lang) => {
        setLanguage(lang);
        setCurrentTranslations(translations[lang]);

        // Get the current user from localStorage
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            try {
                const updatedUser = { ...user, language: lang };
                const response = await fetch(
                    `${config.API_BASE_URL}/editUser`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "ngrok-skip-browser-warning": "true",
                        },
                        body: JSON.stringify({
                            _id: user._id,
                            language: lang,
                        }),
                    }
                );
                if (response.ok) {
                    // Update localStorage with the new user data
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                    // Dispatch a custom event to notify other components
                    window.dispatchEvent(
                        new CustomEvent("userLanguageChanged", {
                            detail: updatedUser,
                        })
                    );
                } else {
                    console.error("Failed to update language preference");
                }
            } catch (error) {
                console.error("Error updating language preference:", error);
            }
        }
    };

    return (
        <LanguageContext.Provider
            value={{
                language,
                translations: currentTranslations,
                changeLanguage,
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};

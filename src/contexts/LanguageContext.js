import React, { createContext, useState, useContext } from "react";
import he from "../locales/he";
import en from "../locales/en";
import ru from "../locales/ru";
import es from "../locales/es";

const LanguageContext = createContext();

const translations = {
    he,
    en,
    ru,
    es,
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState("he");
    const [currentTranslations, setCurrentTranslations] = useState(he);

    const changeLanguage = (lang) => {
        setLanguage(lang);
        setCurrentTranslations(translations[lang]);
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

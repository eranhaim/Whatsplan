import React from "react";
import { Button, Box } from "@mui/material";
import { useLanguage } from "../contexts/LanguageContext";

const LanguageSwitcher = () => {
    const { language, changeLanguage } = useLanguage();

    const languages = [
        { code: "he", flag: "il", alt: "Hebrew" },
        { code: "en", flag: "us", alt: "English" },
        { code: "ru", flag: "ru", alt: "Russian" },
        { code: "es", flag: "es", alt: "Spanish" },
    ];

    return (
        <Box
            sx={{
                position: "fixed",
                top: 16,
                right: 16,
                zIndex: 1000,
                display: "flex",
                gap: 1,
            }}
        >
            {languages.map((lang) => (
                <Button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    sx={{
                        minWidth: "auto",
                        p: 1,
                        opacity: language === lang.code ? 1 : 0.5,
                        "&:hover": { opacity: 1 },
                    }}
                >
                    <img
                        src={`https://flagcdn.com/w20/${lang.flag}.png`}
                        alt={lang.alt}
                        style={{ width: "24px", height: "16px" }}
                    />
                </Button>
            ))}
        </Box>
    );
};

export default LanguageSwitcher;

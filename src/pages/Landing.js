import { Button, Typography, Box, Container } from "@mui/material";
import React from "react";
import { useLanguage } from "../contexts/LanguageContext";

export default function LandingPage() {
    const { translations } = useLanguage();

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #00A884 0%, #128C7E 100%)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                        "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
                    opacity: 0.1,
                    animation: "float 20s linear infinite",
                },
                "@keyframes float": {
                    "0%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-20px)" },
                    "100%": { transform: "translateY(0px)" },
                },
            }}
        >
            <Container maxWidth="md">
                <Box
                    sx={{
                        textAlign: "center",
                        zIndex: 1,
                        animation: "fadeIn 1s ease-in",
                        "@keyframes fadeIn": {
                            "0%": { opacity: 0, transform: "translateY(20px)" },
                            "100%": { opacity: 1, transform: "translateY(0)" },
                        },
                    }}
                >
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: "3rem", sm: "4rem", md: "5rem" },
                            fontWeight: "bold",
                            mb: 4,
                            textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
                        }}
                    >
                        WhatsPlan
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            justifyContent: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        <Button
                            href="/login"
                            variant="contained"
                            sx={{
                                bgcolor: "white",
                                color: "#128C7E",
                                "&:hover": {
                                    bgcolor: "rgba(255,255,255,0.9)",
                                },
                                px: 4,
                                py: 1.5,
                                fontSize: "1.1rem",
                                borderRadius: "50px",
                                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                            }}
                        >
                            {translations.login?.signIn || "Log In"}
                        </Button>
                        <Button
                            href="/signup"
                            variant="outlined"
                            sx={{
                                borderColor: "white",
                                color: "white",
                                "&:hover": {
                                    borderColor: "white",
                                    bgcolor: "rgba(255,255,255,0.1)",
                                },
                                px: 4,
                                py: 1.5,
                                fontSize: "1.1rem",
                                borderRadius: "50px",
                            }}
                        >
                            {translations.login?.signUp || "Sign Up"}
                        </Button>
                    </Box>
                </Box>
            </Container>

            {/* Footer Links */}
            <Box
                sx={{
                    position: "absolute",
                    bottom: 20,
                    right: 20,
                    display: "flex",
                    flexDirection: "row",
                    gap: 2,
                    zIndex: 1,
                }}
            >
                <Button
                    href="/privacy-policy"
                    sx={{
                        color: "rgba(255,255,255,0.8)",
                        textDecoration: "underline",
                        fontSize: "0.875rem",
                        minWidth: "auto",
                        padding: 0,
                        textTransform: "none",
                        "&:hover": {
                            color: "white",
                            backgroundColor: "transparent",
                            textDecoration: "underline",
                        },
                    }}
                >
                    {translations.privacyPolicy || "privacy policy"}
                </Button>
                <Button
                    href="/terms-of-service"
                    sx={{
                        color: "rgba(255,255,255,0.8)",
                        textDecoration: "underline",
                        fontSize: "0.875rem",
                        minWidth: "auto",
                        padding: 0,
                        textTransform: "none",
                        "&:hover": {
                            color: "white",
                            backgroundColor: "transparent",
                            textDecoration: "underline",
                        },
                    }}
                >
                    {translations.termsOfService || "terms of service"}
                </Button>
            </Box>
        </Box>
    );
}

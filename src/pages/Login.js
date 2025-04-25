import React, { useState } from "react";
import {
    Button,
    TextField,
    Box,
    Typography,
    Paper,
    Container,
} from "@mui/material";
import GoogleAuthDialog from "../components/googleAuthDialog";
import { useNavigate } from "react-router-dom";
import config from "../config";
import { useLanguage } from "../contexts/LanguageContext";

export default function LoginPage() {
    const [showGoogleAuth, setShowGoogleAuth] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const { translations } = useLanguage();

    const handleLogin = async (credentials) => {
        try {
            const response = await fetch(`${config.API_BASE_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();
            if (data.success) {
                setUser(data.user);
                if (data.needsGoogleAuth) {
                    setShowGoogleAuth(true);
                } else {
                    navigate(`/user/${data.user.phoneNum}`);
                }
            } else {
                alert(
                    translations.auth?.invalidCredentials ||
                        "Invalid credentials"
                );
            }
        } catch (error) {
            console.error("Login failed:", error);
            alert(translations.auth?.loginFailed || "Login failed");
        }
    };

    return (
        <>
            <GoogleAuthDialog
                open={showGoogleAuth}
                onClose={() => {
                    setShowGoogleAuth(false);
                    navigate(`/user/${user?.phoneNum}`);
                }}
                user={user}
            />
            <Box
                sx={{
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                        "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                    overflow: "hidden",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                }}
            >
                <Container maxWidth="sm">
                    <Paper
                        elevation={3}
                        sx={{
                            p: 4,
                            borderRadius: 2,
                            background: "white",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                mb: 4,
                            }}
                        >
                            <Typography
                                variant="h4"
                                component="h1"
                                sx={{
                                    fontWeight: "bold",
                                    color: "#128C7E",
                                    mb: 2,
                                }}
                            >
                                WhatsPlan
                            </Typography>
                        </Box>

                        <Box
                            component="form"
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 3,
                            }}
                        >
                            <TextField
                                variant="outlined"
                                label={
                                    translations.login?.phoneNumber ||
                                    "Phone Number"
                                }
                                onChange={({ target }) =>
                                    setUser({ ...user, phoneNum: target.value })
                                }
                                value={user?.phoneNum || ""}
                                fullWidth
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "&:hover fieldset": {
                                            borderColor: "#128C7E",
                                        },
                                    },
                                }}
                            />
                            <TextField
                                variant="outlined"
                                label={
                                    translations.login?.password || "Password"
                                }
                                type="password"
                                onChange={({ target }) =>
                                    setUser({ ...user, password: target.value })
                                }
                                value={user?.password || ""}
                                fullWidth
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "&:hover fieldset": {
                                            borderColor: "#128C7E",
                                        },
                                    },
                                }}
                            />
                            <Button
                                variant="contained"
                                onClick={() => handleLogin(user)}
                                sx={{
                                    bgcolor: "#128C7E",
                                    "&:hover": {
                                        bgcolor: "#00A884",
                                    },
                                    py: 1.5,
                                    fontSize: "1.1rem",
                                    borderRadius: "50px",
                                    textTransform: "none",
                                    mt: 2,
                                }}
                            >
                                {translations.login?.signIn || "Sign In"}
                            </Button>
                            <Button
                                variant="text"
                                onClick={() => navigate("/signup")}
                                sx={{
                                    color: "#128C7E",
                                    "&:hover": {
                                        bgcolor: "rgba(18, 140, 126, 0.04)",
                                    },
                                    textTransform: "none",
                                }}
                            >
                                Don't have an account? Sign up
                            </Button>
                            <Button
                                variant="text"
                                onClick={() => navigate("/forgot-password")}
                                sx={{
                                    color: "#128C7E",
                                    "&:hover": {
                                        bgcolor: "rgba(18, 140, 126, 0.04)",
                                    },
                                    textTransform: "none",
                                }}
                            >
                                Forgot Password?
                            </Button>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </>
    );
}

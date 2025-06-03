import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
    Button,
    TextField,
    Box,
    Typography,
    Paper,
    Container,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import config from "../config";
import { useLanguage } from "../contexts/LanguageContext";
import { useGoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const { translations } = useLanguage();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const handleLogin = async (credentials) => {
        try {
            const response = await fetch(`${config.API_BASE_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();
            if (data.success) {
                setUser(data.user);
                localStorage.setItem("user", JSON.stringify(data.user));
                navigate(`/user/${data.user._id}`);
            } else {
                alert(translations.invalidCredentials || "Invalid credentials");
            }
        } catch (error) {
            console.error("Login failed:", error);
            alert(translations.loginFailed || "Login failed");
        }
    };

    const googleLogin = useGoogleLogin({
        scope: "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events",
        onSuccess: async (tokenResponse) => {
            try {
                // Get user info from Google
                const userInfoResponse = await fetch(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    {
                        headers: {
                            Authorization: `Bearer ${tokenResponse.access_token}`,
                        },
                    }
                );
                const userInfo = await userInfoResponse.json();

                // Send to our backend
                const response = await fetch(
                    `${config.API_BASE_URL}/auth/google`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: userInfo.email,
                            name: userInfo.name,
                            picture: userInfo.picture,
                            sub: userInfo.sub,
                            access_token: tokenResponse.access_token,
                            language: userInfo.locale?.split("_")[0] || "he",
                            userInfo: { locale: userInfo.locale },
                        }),
                    }
                );

                const data = await response.json();
                if (data.success) {
                    setUser(data.user);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    navigate(`/user/${data.user._id}`);
                } else {
                    alert("Google sign-in failed");
                }
            } catch (error) {
                console.error("Google login error:", error);
                alert("Google sign-in failed");
            }
        },
        onError: () => {
            alert("Google sign-in failed");
        },
    });

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                overflow: "auto",
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                px: { xs: 2, sm: 3 },
                py: { xs: 4, sm: 0 },
            }}
        >
            <Container maxWidth="sm" sx={{ width: "100%" }}>
                <Paper
                    elevation={3}
                    sx={{
                        p: { xs: 3, sm: 4 },
                        borderRadius: 2,
                        background: "white",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                        width: "100%",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            mb: { xs: 3, sm: 4 },
                        }}
                    >
                        <Typography
                            variant={isMobile ? "h5" : "h4"}
                            component="h1"
                            sx={{
                                fontWeight: "bold",
                                color: "#128C7E",
                                mb: 2,
                            }}
                        >
                            WhatsPlan
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                color: "text.secondary",
                                textAlign: "center",
                            }}
                        >
                            {translations.welcomeBack || "Welcome back"}
                        </Typography>
                    </Box>

                    <Box
                        component="form"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: { xs: 2, sm: 3 },
                            width: "100%",
                        }}
                    >
                        <PhoneInput
                            country={"il"}
                            value={user?.phoneNum || ""}
                            onChange={(phone) =>
                                setUser({ ...user, phoneNum: phone })
                            }
                            inputStyle={{
                                width: "100%",
                                height: isMobile ? "50px" : "56px",
                                fontSize: isMobile ? "14px" : "16px",
                                borderRadius: "4px",
                                border: "1px solid rgba(0, 0, 0, 0.23)",
                            }}
                            containerStyle={{
                                width: "100%",
                            }}
                            buttonStyle={{
                                border: "1px solid rgba(0, 0, 0, 0.23)",
                                borderRight: "none",
                                borderRadius: "4px 0 0 4px",
                                backgroundColor: "transparent",
                            }}
                        />
                        <TextField
                            variant="outlined"
                            label={translations.password}
                            type="password"
                            name="current-password"
                            onChange={({ target }) =>
                                setUser({ ...user, password: target.value })
                            }
                            value={user?.password || ""}
                            fullWidth
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    height: isMobile ? "50px" : "56px",
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
                                py: { xs: 1, sm: 1.5 },
                                fontSize: { xs: "1rem", sm: "1.1rem" },
                                borderRadius: "50px",
                                textTransform: "none",
                                mt: { xs: 1, sm: 2 },
                            }}
                        >
                            {translations.signIn}
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => googleLogin()}
                            sx={{
                                color: "#4285F4",
                                borderColor: "#4285F4",
                                textTransform: "none",
                                fontWeight: 600,
                                mt: 1,
                                mb: 1,
                            }}
                        >
                            <img
                                src="https://developers.google.com/identity/images/g-logo.png"
                                alt="Google"
                                style={{
                                    width: 20,
                                    marginRight: 8,
                                    verticalAlign: "middle",
                                }}
                            />
                            Sign in with Google
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
                                py: { xs: 0.5, sm: 1 },
                            }}
                        >
                            {translations.dontHaveAccount ||
                                "Don't have an account? Sign up"}
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
                                py: { xs: 0.5, sm: 1 },
                            }}
                        >
                            {translations.forgotPassword || "Forgot Password?"}
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}

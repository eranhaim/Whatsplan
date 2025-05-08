import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
    Button,
    TextField,
    Box,
    Typography,
    Paper,
    Container,
    Link,
    Stack,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import config from "../config";
import LegalConsentDialogs from "../components/LegalConsentDialogs";

export default function SignUpPage() {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        phoneNum: "",
    });
    const [termsOpen, setTermsOpen] = useState(false);
    const [privacyOpen, setPrivacyOpen] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const handleSignUp = async () => {
        if (!termsAccepted || !privacyAccepted) {
            alert(
                "Please accept both the Terms of Service and Privacy Policy to continue."
            );
            return;
        }

        try {
            const response = await fetch(`${config.API_BASE_URL}/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
                body: JSON.stringify(user),
            });
            const data = await response.json();
            if (data.success) {
                navigate("/login");
            } else {
                alert(
                    data.alreadyExists
                        ? "User already exists"
                        : "Sign up failed"
                );
            }
        } catch (error) {
            console.error("Sign up failed:", error);
            alert("Sign up failed. Please try again.");
        }
    };

    const handleTermsClick = (e) => {
        e.preventDefault();
        setTermsOpen(true);
    };

    const handlePrivacyClick = (e) => {
        e.preventDefault();
        setPrivacyOpen(true);
    };

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
                            mb: { xs: 2, sm: 4 },
                        }}
                    >
                        <Typography
                            variant={isMobile ? "h5" : "h4"}
                            component="h1"
                            sx={{
                                fontWeight: "bold",
                                color: "#128C7E",
                                mb: { xs: 1, sm: 2 },
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
                            Create your account
                        </Typography>
                    </Box>

                    <Box
                        component="form"
                        onSubmit={(e) => e.preventDefault()}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: { xs: 2, sm: 3 },
                            width: "100%",
                        }}
                    >
                        <TextField
                            variant="outlined"
                            label="Name"
                            autoComplete="off"
                            onChange={({ target }) =>
                                setUser({ ...user, name: target.value })
                            }
                            value={user.name}
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
                        <TextField
                            variant="outlined"
                            label="Email"
                            type="email"
                            autoComplete="off"
                            onChange={({ target }) =>
                                setUser({ ...user, email: target.value })
                            }
                            value={user.email}
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
                        <TextField
                            variant="outlined"
                            label="Password"
                            type="password"
                            autoComplete="new-password"
                            onChange={({ target }) =>
                                setUser({ ...user, password: target.value })
                            }
                            value={user.password}
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
                        <PhoneInput
                            country={"il"}
                            value={user.phoneNum}
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

                        <Stack spacing={1} sx={{ mt: { xs: 1, sm: 2 } }}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                align="center"
                                sx={{ fontSize: isMobile ? "12px" : "14px" }}
                            >
                                By signing up, you agree to our{" "}
                                <Link
                                    component="button"
                                    variant="body2"
                                    onClick={handleTermsClick}
                                    sx={{ fontWeight: "medium" }}
                                >
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link
                                    component="button"
                                    variant="body2"
                                    onClick={handlePrivacyClick}
                                    sx={{ fontWeight: "medium" }}
                                >
                                    Privacy Policy
                                </Link>
                            </Typography>

                            <Button
                                variant="contained"
                                onClick={handleSignUp}
                                sx={{
                                    bgcolor: "#128C7E",
                                    color: "white",
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
                                Sign Up
                            </Button>

                            <Button
                                variant="text"
                                onClick={() => navigate("/login")}
                                sx={{
                                    color: "#128C7E",
                                    textTransform: "none",
                                    py: { xs: 0.5, sm: 1 },
                                    fontSize: { xs: "14px", sm: "16px" },
                                }}
                            >
                                Already have an account? Log in
                            </Button>
                        </Stack>
                    </Box>
                </Paper>
            </Container>

            <LegalConsentDialogs
                termsOpen={termsOpen}
                privacyOpen={privacyOpen}
                termsAccepted={termsAccepted}
                privacyAccepted={privacyAccepted}
                handleTermsClose={() => setTermsOpen(false)}
                handlePrivacyClose={() => setPrivacyOpen(false)}
                handleTermsAccept={setTermsAccepted}
                handlePrivacyAccept={setPrivacyAccepted}
            />
        </Box>
    );
}

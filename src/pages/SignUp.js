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
    Stack,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import config from "../config";
import LegalConsentDialogs from "../components/LegalConsentDialogs";
import { useLanguage } from "../contexts/LanguageContext";

export default function SignUpPage() {
    const { translations } = useLanguage();
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        phoneNum: "",
    });
    const [termsOpen, setTermsOpen] = useState(false);
    const [privacyOpen, setPrivacyOpen] = useState(false);
    const [combinedOpen, setCombinedOpen] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const handleSignUp = async () => {
        if (!termsAccepted || !privacyAccepted) {
            setCombinedOpen(true);
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
                        ? translations.userExists
                        : translations.signupFailed
                );
            }
        } catch (error) {
            console.error("Sign up failed:", error);
            alert(translations.signupFailed);
        }
    };

    const handleCombinedClose = () => {
        if (termsAccepted && privacyAccepted) {
            setCombinedOpen(false);
            // If both terms are accepted when closing, proceed with signup
            handleSubmitSignup();
        } else {
            setCombinedOpen(false);
        }
    };

    // Separated the actual signup submission from the initial check
    const handleSubmitSignup = async () => {
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
                        ? translations.userExists
                        : translations.signupFailed
                );
            }
        } catch (error) {
            console.error("Sign up failed:", error);
            alert(translations.signupFailed);
        }
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
                            {translations.createAccount ||
                                "Create your account"}
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
                            label={translations.name}
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
                            label={translations.email}
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
                            label={translations.password}
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
                                {translations.signUp}
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{
                                    color: "#4285F4",
                                    borderColor: "#4285F4",
                                    textTransform: "none",
                                    fontWeight: 600,
                                    mt: 1,
                                    mb: 1,
                                }}
                                onClick={async () => {
                                    try {
                                        const clientId =
                                            process.env
                                                .REACT_APP_GOOGLE_CLIENT_ID;
                                        if (!window.google || !clientId) {
                                            alert(
                                                "Google sign-in not available"
                                            );
                                            return;
                                        }

                                        // Initialize Google Identity Services
                                        window.google.accounts.id.initialize({
                                            client_id: clientId,
                                            callback: async (response) => {
                                                if (!response.credential) {
                                                    console.error(
                                                        "No credential received"
                                                    );
                                                    return;
                                                }

                                                try {
                                                    const res = await fetch(
                                                        `${config.API_BASE_URL}/auth/google`,
                                                        {
                                                            method: "POST",
                                                            headers: {
                                                                "Content-Type":
                                                                    "application/json",
                                                                "ngrok-skip-browser-warning":
                                                                    "true",
                                                            },
                                                            body: JSON.stringify(
                                                                {
                                                                    idToken:
                                                                        response.credential,
                                                                }
                                                            ),
                                                        }
                                                    );

                                                    const data =
                                                        await res.json();
                                                    if (data.success) {
                                                        setUser(data.user);
                                                        localStorage.setItem(
                                                            "user",
                                                            JSON.stringify(
                                                                data.user
                                                            )
                                                        );
                                                        navigate(
                                                            `/user/${
                                                                data.user
                                                                    .phoneNum ||
                                                                data.user._id
                                                            }`
                                                        );
                                                    } else {
                                                        alert(
                                                            "Google sign-in failed: " +
                                                                (data.error ||
                                                                    "Unknown error")
                                                        );
                                                    }
                                                } catch (err) {
                                                    console.error(
                                                        "API error:",
                                                        err
                                                    );
                                                    alert(
                                                        "Failed to communicate with server"
                                                    );
                                                }
                                            },
                                            auto_select: false,
                                        });

                                        // Prompt for Google sign-in
                                        window.google.accounts.id.prompt();
                                    } catch (error) {
                                        console.error(
                                            "Google sign-in error:",
                                            error
                                        );
                                        alert("Google sign-in failed");
                                    }
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
                                Sign up with Google
                            </Button>
                            {/* End Google Sign-Up Button */}
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
                                {translations.alreadyHaveAccount ||
                                    "Already have an account? Log in"}
                            </Button>
                        </Stack>
                    </Box>
                </Paper>
            </Container>

            <LegalConsentDialogs
                termsOpen={termsOpen}
                privacyOpen={privacyOpen}
                combinedOpen={combinedOpen}
                termsAccepted={termsAccepted}
                privacyAccepted={privacyAccepted}
                handleTermsClose={() => setTermsOpen(false)}
                handlePrivacyClose={() => setPrivacyOpen(false)}
                handleCombinedClose={handleCombinedClose}
                handleTermsAccept={setTermsAccepted}
                handlePrivacyAccept={setPrivacyAccepted}
            />
        </Box>
    );
}

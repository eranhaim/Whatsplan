import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import config from "../config";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const handleSubmit = async () => {
        if (!email) {
            setError("Please enter your email");
            return;
        }

        try {
            const response = await fetch(
                `${config.API_BASE_URL}/forgot-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                }
            );

            const data = await response.json();
            if (data.success) {
                setSuccess(true);
            } else {
                setError(data.error || "Failed to send reset email");
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
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
                            mb: { xs: 3, sm: 4 },
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
                            Forgot Password
                        </Typography>
                    </Box>

                    {success ? (
                        <Typography
                            variant="body1"
                            color="success.main"
                            align="center"
                            sx={{ px: { xs: 1, sm: 2 } }}
                        >
                            If an account exists with this email, you will
                            receive a password reset link.
                        </Typography>
                    ) : (
                        <Box
                            component="form"
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: { xs: 2, sm: 3 },
                                width: "100%",
                            }}
                        >
                            <TextField
                                variant="outlined"
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                fullWidth
                                error={!!error}
                                helperText={error}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        height: isMobile ? "50px" : "56px",
                                    },
                                }}
                            />
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
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
                                Send Reset Link
                            </Button>
                            <Button
                                variant="text"
                                onClick={() => navigate("/login")}
                                sx={{
                                    color: "#128C7E",
                                    "&:hover": {
                                        bgcolor: "rgba(18, 140, 126, 0.04)",
                                    },
                                    textTransform: "none",
                                    py: { xs: 0.5, sm: 1 },
                                }}
                            >
                                Back to Login
                            </Button>
                        </Box>
                    )}
                </Paper>
            </Container>
        </Box>
    );
}

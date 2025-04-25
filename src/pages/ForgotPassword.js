import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Button,
    TextField,
    Box,
    Typography,
    Paper,
    Container,
} from "@mui/material";
import config from "../config";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

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
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
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
                            Forgot Password
                        </Typography>
                    </Box>

                    {success ? (
                        <Typography
                            variant="body1"
                            color="success.main"
                            align="center"
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
                                gap: 3,
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
                                    py: 1.5,
                                    fontSize: "1.1rem",
                                    borderRadius: "50px",
                                    textTransform: "none",
                                    mt: 2,
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

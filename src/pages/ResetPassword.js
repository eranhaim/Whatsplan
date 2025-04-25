import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    Button,
    TextField,
    Box,
    Typography,
    Paper,
    Container,
} from "@mui/material";
import config from "../config";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleResetPassword = async () => {
        // Validate passwords
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await fetch(
                `${config.API_BASE_URL}/reset-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "ngrok-skip-browser-warning": "true",
                    },
                    body: JSON.stringify({
                        token,
                        newPassword,
                    }),
                }
            );

            const data = await response.json();
            if (data.success) {
                setSuccess(true);
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            } else {
                setError(
                    data.error || "Failed to reset password. Please try again."
                );
            }
        } catch (error) {
            console.error("Error resetting password:", error);
            setError("An error occurred. Please try again.");
        }
    };

    if (!token) {
        return (
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
                        <Typography variant="h6" color="error" align="center">
                            Invalid or expired reset link. Please request a new
                            password reset.
                        </Typography>
                        <Button
                            variant="text"
                            onClick={() => navigate("/forgot-password")}
                            sx={{
                                color: "#128C7E",
                                display: "block",
                                margin: "20px auto 0",
                                "&:hover": {
                                    bgcolor: "rgba(18, 140, 126, 0.04)",
                                },
                            }}
                        >
                            Go to Forgot Password
                        </Button>
                    </Paper>
                </Container>
            </Box>
        );
    }

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
                            Reset Password
                        </Typography>
                    </Box>

                    {success ? (
                        <Typography
                            variant="body1"
                            color="success.main"
                            align="center"
                        >
                            Password reset successfully! Redirecting to login...
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
                                label="New Password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                error={!!error}
                                fullWidth
                            />
                            <TextField
                                variant="outlined"
                                label="Confirm New Password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                error={!!error}
                                helperText={error}
                                fullWidth
                            />
                            <Button
                                variant="contained"
                                onClick={handleResetPassword}
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
                                Reset Password
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

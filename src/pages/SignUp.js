import React, { useState } from "react";
import {
    Button,
    TextField,
    Box,
    Typography,
    Paper,
    Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import config from "../config";

export default function SignUpPage() {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        phoneNum: "",
        govID: "",
        nationality: "",
    });
    const navigate = useNavigate();

    const handleSignUp = async () => {
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

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                py: 4,
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
                        transform: "translateY(0)",
                        transition: "transform 0.3s ease-in-out",
                        "&:hover": {
                            transform: "translateY(-5px)",
                        },
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
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 3,
                        }}
                    >
                        <TextField
                            variant="outlined"
                            label="Name"
                            onChange={({ target }) =>
                                setUser({ ...user, name: target.value })
                            }
                            value={user.name}
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
                            label="Email"
                            type="email"
                            onChange={({ target }) =>
                                setUser({ ...user, email: target.value })
                            }
                            value={user.email}
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
                            label="Password"
                            type="password"
                            onChange={({ target }) =>
                                setUser({ ...user, password: target.value })
                            }
                            value={user.password}
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
                            label="Phone Number"
                            onChange={({ target }) =>
                                setUser({ ...user, phoneNum: target.value })
                            }
                            value={user.phoneNum}
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
                            label="Government ID"
                            onChange={({ target }) =>
                                setUser({ ...user, govID: target.value })
                            }
                            value={user.govID}
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
                            label="Nationality"
                            onChange={({ target }) =>
                                setUser({ ...user, nationality: target.value })
                            }
                            value={user.nationality}
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
                            onClick={handleSignUp}
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
                            Sign Up
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
                            Already have an account? Log in
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}

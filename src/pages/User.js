import { Box, Container, Grid } from "@mui/material";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import config from "../config";
import UserProfile from "../components/UserPage/UserProfile";

export default function UserPage() {
    const [user, setUser] = useState(null);
    const [qrCode, setQrCode] = useState(null);
    const [isInSession, setIsInSession] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { userId } = useParams();
    const navigate = useNavigate();

    // Authentication check - runs first
    useEffect(() => {
        const checkAuthentication = () => {
            const storedUser = localStorage.getItem("user");

            if (!storedUser) {
                // No user data in localStorage, redirect to login
                navigate("/login");
                return;
            }

            try {
                const userData = JSON.parse(storedUser);

                // Check if the stored user ID matches the URL parameter
                if (userData._id !== userId) {
                    // User ID mismatch, redirect to login
                    navigate("/login");
                    return;
                }

                // User is authenticated and matches URL
                setIsAuthenticated(true);
                setUser(userData);
            } catch (error) {
                // Invalid JSON in localStorage, redirect to login
                console.error("Invalid user data in localStorage:", error);
                localStorage.removeItem("user");
                navigate("/login");
            }
        };

        checkAuthentication();
    }, [userId, navigate]);

    useEffect(() => {
        const fetchUser = async () => {
            // Only fetch user data if authenticated
            if (!isAuthenticated || !userId) {
                return;
            }

            try {
                const response = await fetch(
                    `${config.API_BASE_URL}/getUser/${userId}`,
                    {
                        method: "GET",
                    }
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }
                const data = await response.json();
                if (!data.success || !data.user) {
                    throw new Error("User not found");
                }

                setUser(data.user);
                // Update localStorage with latest user data
                localStorage.setItem("user", JSON.stringify(data.user));

                const sessionResponse = await fetch(
                    `${config.API_BASE_URL}/startOrLoadSession/${data.user._id}`,
                    {
                        method: "GET",
                    }
                );
                if (!sessionResponse.ok) {
                    throw new Error("Failed to start session");
                }

                const sessionData = await sessionResponse.json();
                if (sessionData.success) {
                    if (sessionData.qr) {
                        setQrCode(sessionData.qr);
                    } else {
                        setIsInSession(true);
                    }
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                // If there's an error fetching user data, it might mean the user is no longer valid
                // Redirect to login
                navigate("/login");
            }
        };

        fetchUser();
    }, [userId, isAuthenticated, navigate]);

    // Keep localStorage in sync with user state changes
    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        }
    }, [user]);

    // Listen for language changes
    useEffect(() => {
        const handleLanguageChange = (event) => {
            setUser(event.detail);
        };

        window.addEventListener("userLanguageChanged", handleLanguageChange);
        return () => {
            window.removeEventListener(
                "userLanguageChanged",
                handleLanguageChange
            );
        };
    }, []);

    // Don't render anything until authentication is verified
    if (!isAuthenticated) {
        return null;
    }

    return (
        <>
            <Box
                sx={{
                    minHeight: "100vh",
                    background:
                        "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                    p: { xs: 1, sm: 2, md: 3 },
                    boxSizing: "border-box",
                    overflow: "auto",
                }}
            >
                <Container
                    maxWidth="lg"
                    sx={{
                        width: "100%",
                        px: { xs: 1, sm: 2 },
                    }}
                >
                    <Grid
                        container
                        spacing={{ xs: 2, md: 3 }}
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            alignItems: "stretch",
                            gap: { xs: 2, md: 3 },
                            width: "100%",
                            pb: 2,
                        }}
                    >
                        <Grid
                            item
                            xs={12}
                            sm={4}
                            sx={{
                                flex: { sm: 1 },
                                width: "100%",
                                maxWidth: {
                                    xs: "100%",
                                    sm: "100%",
                                    md: "400px",
                                },
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <UserProfile
                                user={user}
                                isInSession={isInSession}
                                qrCode={qrCode}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
}

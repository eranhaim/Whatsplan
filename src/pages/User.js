import { Box, Container, Grid } from "@mui/material";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import config from "../config";
import UserProfile from "../components/UserPage/UserProfile";
import { useSnackbar } from "../contexts/SnackbarContext";
import GoogleAuthDialog from "../components/googleAuthDialog";

export default function UserPage() {
    const [user, setUser] = useState(null);
    const [qrCode, setQrCode] = useState(null);
    const [isInSession, setIsInSession] = useState(false);
    const { phoneNum } = useParams();
    const { showSnackbar } = useSnackbar();
    const [showGoogleAuth, setShowGoogleAuth] = useState(false);
    const [forceGoogleConsent, setForceGoogleConsent] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            if (!phoneNum) {
                return;
            }

            try {
                const response = await fetch(
                    `${config.API_BASE_URL}/getUser/${phoneNum}`,
                    {
                        method: "GET",
                        headers: {
                            "ngrok-skip-browser-warning": "true",
                        },
                    }
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }
                const userData = await response.json();

                if (!userData) {
                    throw new Error("User not found");
                }

                setUser(userData);
                // Update localStorage with latest user data
                localStorage.setItem("user", JSON.stringify(userData));

                const sessionResponse = await fetch(
                    `${config.API_BASE_URL}/startOrLoadSession/${userData._id}`,
                    {
                        method: "GET",
                        headers: {
                            "ngrok-skip-browser-warning": "true",
                        },
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

                // Check for Google Calendar errors in the response
                if (sessionData.googleCalendarError) {
                    handleGoogleCalendarError({ needsReauth: true });
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchUser();
    });

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

    // Add a handler for Google Calendar API errors
    const handleGoogleCalendarError = (error) => {
        if (error?.needsReauth) {
            setForceGoogleConsent(true);
            setShowGoogleAuth(true);
        } else {
            showSnackbar("An error occurred with Google Calendar", "error");
        }
    };

    return (
        <>
            {/* Add the GoogleAuthDialog component */}
            {user && (
                <GoogleAuthDialog
                    open={showGoogleAuth}
                    onClose={() => setShowGoogleAuth(false)}
                    user={user}
                    forceConsent={forceGoogleConsent}
                />
            )}

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

import { Check } from "@mui/icons-material";
import {
    Typography,
    Box,
    Card,
    CardContent,
    LinearProgress,
} from "@mui/material";
import { useLanguage } from "../../contexts/LanguageContext";
import { useState, useEffect } from "react";

export default function UserProfile({ user, isInSession, qrCode }) {
    const { translations } = useLanguage();
    const [timeLeft, setTimeLeft] = useState(60);

    useEffect(() => {
        // Reset timer when QR code appears
        if (qrCode) {
            setTimeLeft(60);
        }
    }, [qrCode]);

    useEffect(() => {
        // Only run countdown when QR code is displayed
        if (!qrCode || isInSession || timeLeft <= 0) {
            // Refresh the window when timer reaches 0 and QR code is still displayed
            if (qrCode && !isInSession && timeLeft <= 0) {
                window.location.reload();
            }
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [qrCode, isInSession, timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    return (
        <Card
            sx={{
                borderRadius: 2,
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                height: "100%",
                minHeight: "400px",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
            }}
        >
            <CardContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 4,
                    gap: 3,
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: "bold",
                        color: "#128C7E",
                        wordBreak: "break-word",
                    }}
                >
                    {user?.name}
                </Typography>

                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    {isInSession ? (
                        <Check
                            sx={{
                                fontSize: 60,
                                color: "#00A884",
                                border: "2px solid #00A884",
                                borderRadius: "50%",
                                p: 1,
                            }}
                        />
                    ) : (
                        <Box
                            sx={{
                                width: "100%",
                                maxWidth: 200,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            {!qrCode && (
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    {translations.loadingQR}
                                </div>
                            )}
                            {!qrCode && <LinearProgress />}
                            {qrCode && (
                                <>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: "bold",
                                            color: "#128C7E",
                                            wordBreak: "break-word",
                                            textAlign: "center",
                                        }}
                                    >
                                        {
                                            "פתח וואטצפ > הגדרות > מכשירים מקושרים > הוסף מכשיר"
                                        }
                                    </Typography>
                                    <img
                                        src={qrCode}
                                        alt="QR Code"
                                        style={{
                                            width: "100%",
                                            height: "auto",
                                            borderRadius: "8px",
                                        }}
                                    />
                                    <Typography
                                        sx={{
                                            mt: 2,
                                            fontWeight: "bold",
                                            color:
                                                timeLeft <= 10
                                                    ? "error.main"
                                                    : "text.primary",
                                        }}
                                    >
                                        {formatTime(timeLeft)}
                                    </Typography>
                                </>
                            )}
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}

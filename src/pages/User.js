import { Check, Save } from "@mui/icons-material";
import {
    Button,
    Checkbox,
    LinearProgress,
    TextField,
    Typography,
    Box,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import config from "../config";
import { useLanguage } from "../contexts/LanguageContext";

export default function UserPage() {
    const [user, setUser] = useState(null);
    const [qrCode, setQrCode] = useState(null);
    const [isInSession, setIsInSession] = useState(false);
    const { phoneNum } = useParams();
    const { translations, language } = useLanguage();

    const botSettings = [
        {
            id: "1",
            text: translations.weeklySummary,
        },
        {
            id: "2",
            text: translations.dailyUpdate,
        },
        {
            id: "3",
            text: translations.googleCalendar,
        },
        {
            id: "4",
            text: translations.eventNotifications,
        },
    ];

    useEffect(() => {
        const fetchUser = async () => {
            if (!phoneNum) {
                return;
            }

            try {
                const response = await fetch(
                    `${config.API_BASE_URL}/getUser/${phoneNum}`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }
                const userData = await response.json();

                if (!userData) {
                    throw new Error("User not found");
                }

                setUser(userData);

                const sessionResponse = await fetch(
                    `${config.API_BASE_URL}/startOrLoadSession/${userData._id}`
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
            } finally {
            }
        };

        fetchUser();
    }, [phoneNum]);

    const getSummery = async () => {
        try {
            const response = await fetch(
                `${config.API_BASE_URL}/getWeeklyEvents`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userID: user._id,
                        type: "getEvents",
                    }),
                }
            );
            const data = await response.json();
            if (data.success) {
                // Handle success
            }
        } catch (error) {
            console.error("Error making bot request:", error);
        }
    };

    const changeSettings = (id) => {
        if (user.settingsFlags?.indexOf(id) === -1) {
            setUser({ ...user, settingsFlags: user.settingsFlags + id });
        } else {
            setUser({
                ...user,
                settingsFlags: (user.settingsFlags || "").replace(id, ""),
            });
        }
    };

    const saveSettings = async () => {
        try {
            const response = await fetch(`${config.API_BASE_URL}/editUser`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });
            const data = await response.json();
            if (data.success) {
                setUser(user);
            }
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const connectToGoogleCalendar = async () => {
        try {
            const response = await fetch(
                `${config.API_BASE_URL}/initiateGoogleAuth?userID=${user._id}`
            );
            const data = await response.json();
            if (data.authUrl) {
                window.location.href = data.authUrl;
            }
        } catch (error) {
            console.error("Error initiating Google auth:", error);
        }
    };

    return (
        <Box
            sx={{
                height: "95vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 2,
            }}
        >
            {
                <Box
                    sx={{
                        flex: 1,
                        backgroundColor: "#f3f3f3",
                        borderRadius: 2,
                        boxShadow: "0px 0px 7px 0px rgba(0,0,0,0.5)",
                        padding: 2,
                        display: "flex",
                        flexDirection: "column",
                        direction: language === "he" ? "rtl" : "ltr",
                        minWidth: 400,
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            textAlign: "center",
                            fontWeight: "bold",
                            mb: 2,
                        }}
                    >
                        {user?.name}
                    </Typography>

                    <Box sx={{ textAlign: "center", mb: 2 }}>
                        {isInSession ? (
                            <Check
                                sx={{
                                    fontSize: 60,
                                    border: "1px solid black",
                                    borderRadius: "50%",
                                    backgroundColor: "#00A884",
                                    p: 1,
                                }}
                            />
                        ) : (
                            <Box>
                                {!qrCode && <LinearProgress />}
                                {qrCode && <img src={qrCode} alt="QR Code" />}
                            </Box>
                        )}
                    </Box>

                    <Typography variant="h6" sx={{ mb: 2 }}>
                        {translations.botSettings}
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={getSummery}
                            sx={{ backgroundColor: "#00A884" }}
                        >
                            {translations.getWeeklyUpdate}
                        </Button>

                        {botSettings.map((item) => (
                            <Box
                                key={item.id}
                                sx={{ display: "flex", alignItems: "center" }}
                            >
                                <Checkbox
                                    checked={
                                        user?.settingsFlags?.includes(
                                            item.id
                                        ) || false
                                    }
                                    onChange={() => changeSettings(item.id)}
                                />
                                <Typography>{item.text}</Typography>
                            </Box>
                        ))}

                        {user?.settingsFlags?.includes("4") && (
                            <TextField
                                value={
                                    user?.settings
                                        ?.timeBeforeEventNotification || ""
                                }
                                onChange={({ target }) => {
                                    setUser({
                                        ...user,
                                        settings: {
                                            ...user.settings,
                                            timeBeforeEventNotification:
                                                target.value,
                                        },
                                    });
                                }}
                                fullWidth
                                type="number"
                                label={translations.minutesBeforeEvent}
                                inputProps={{
                                    step: 15,
                                    max: 2500,
                                    min: 0,
                                }}
                            />
                        )}

                        <Button
                            variant="outlined"
                            onClick={connectToGoogleCalendar}
                            sx={{ mt: 2 }}
                        >
                            {translations.connectGoogleCalendar}
                        </Button>

                        <Button
                            variant="outlined"
                            endIcon={<Save sx={{ marginRight: 1 }} />}
                            onClick={saveSettings}
                            sx={{ mt: 2 }}
                        >
                            {translations.saveSettings}
                        </Button>
                    </Box>
                </Box>
            }
        </Box>
    );
}

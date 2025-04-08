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
import { useParams, useNavigate } from "react-router-dom";
import config from "../config";

export default function UserPage() {
    const [user, setUser] = useState(null);
    const [qrCode, setQrCode] = useState(null);
    const [isInSession, setIsInSession] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { phoneNum } = useParams();
    const navigate = useNavigate();

    const botSettings = [
        {
            id: "1",
            text: "לקבל סיכום שבועי בראשון",
        },
        {
            id: "2",
            text: "לקבל עדכון יומי בבוקר כל יום",
        },
        {
            id: "3",
            text: "לקבוע אירועים ביומן Google Calandar",
        },
        {
            id: "4",
            text: "לקבל עדכונים לפני אירועים",
        },
    ];

    useEffect(() => {
        const fetchUser = async () => {
            if (!phoneNum) {
                setError("Phone number is required");
                setLoading(false);
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
                setError(error.message);
            } finally {
                setLoading(false);
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

    const connectToGoogleCalandar = async () => {
        try {
            const response = await fetch(
                `${config.API_BASE_URL}/initiateGoogleAuth`
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
                        direction: "rtl",
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
                        הגדרות בוט
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
                            לקבל עדכון שבועי עכשיו
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
                                label="מספר דקות לפני אירוע לעדכון"
                                inputProps={{
                                    step: 15,
                                    max: 2500,
                                    min: 0,
                                }}
                            />
                        )}

                        <Button
                            variant="outlined"
                            onClick={connectToGoogleCalandar}
                            sx={{ mt: 2 }}
                        >
                            התחבר ל-Google Calandar
                        </Button>

                        <Button
                            variant="outlined"
                            endIcon={<Save sx={{ marginRight: 1 }} />}
                            onClick={saveSettings}
                            sx={{ mt: 2 }}
                        >
                            שמור הגדרות
                        </Button>
                    </Box>
                </Box>
            }
        </Box>
    );
}

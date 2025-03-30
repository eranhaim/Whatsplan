import { Check, Save } from "@mui/icons-material";
import { Button, Checkbox, LinearProgress, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import config from "../config";

export default function UserPage() {
    const [user, setUser] = useState(null);
    const [qrCode, setQrCode] = useState(null);
    const [isInSession, setIsInSession] = useState(false);
    const [loading, setLoading] = useState(true);
    const { phoneNum } = useParams();

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

    window.onclick = () => console.log(user);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(
                    `${config.API_BASE_URL}/getUser/${phoneNum}`
                );
                const userData = await response.json();
                setUser(userData);

                if (userData) {
                    const sessionResponse = await fetch(
                        `${config.API_BASE_URL}/startOrLoadSession/${userData._id}`
                    );
                    const sessionData = await sessionResponse.json();
                    if (sessionData.success) {
                        if (sessionData.qr) {
                            setQrCode(sessionData.qr);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [phoneNum]);

    const getSummery = async () => {
        try {
            const response = await fetch(
                `${config.API_BASE_URL}/clientBotRequest`,
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
            console.log(user.settingsFlags + id);
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>User not found</div>;
    }

    return (
        <div
            style={{
                height: "95vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 10,
            }}
        >
            <div
                style={{
                    flex: 1,
                    backgroundColor: "#f3f3f3",
                    borderRadius: 10,
                    boxShadow: "black 0px 0px 7px 0px",
                    padding: 10,
                    display: "flex",
                    flexDirection: "column",
                    direction: "rtl",
                    minWidth: 400,
                }}
            >
                <div
                    style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: 30,
                    }}
                >
                    {user?.name}
                </div>
                <div>
                    {isInSession ? (
                        <div style={{ textAlign: "center" }}>
                            <Check
                                style={{
                                    marginTop: 20,
                                    fontSize: 60,
                                    border: "1px solid black",
                                    borderRadius: "50%",
                                    backgroundColor: "#00A884",
                                }}
                            />
                        </div>
                    ) : (
                        <div>
                            {!qrCode && <LinearProgress />}
                            <img src={qrCode} alt={""} />
                        </div>
                    )}
                </div>
                <h3>הגדרות בוט</h3>
                <div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div>
                            <Button
                                style={{ color: "#f3f3f3" }}
                                variant="contained"
                                onClick={getSummery}
                            >
                                לקבל עדכון שבועי עכשיו
                            </Button>
                        </div>
                        {botSettings.map((item) => (
                            <div key={item.id}>
                                <Checkbox
                                    checked={
                                        user?.settingsFlags?.includes(
                                            item.id
                                        ) || false
                                    }
                                    onChange={() => changeSettings(item.id)}
                                />
                                {item.text}
                            </div>
                        ))}
                        {user?.settingsFlags?.includes("4") && (
                            <div>
                                <TextField
                                    value={
                                        user?.settings
                                            ?.timeBeforeEventNotification
                                    }
                                    onChange={({ target }) => {
                                        if (user.settings) {
                                            setUser({
                                                ...user,
                                                settings: {
                                                    timeBeforeEventNotification:
                                                        target.value,
                                                },
                                            });
                                        } else {
                                            setUser({
                                                ...user,
                                                settings: {
                                                    ...user.settings,
                                                    timeBeforeEventNotification:
                                                        target.value,
                                                },
                                            });
                                        }
                                    }}
                                    fullWidth
                                    type="number"
                                    label="מספר דקות לפני אירוע לעדכון"
                                    slotProps={{
                                        htmlInput: {
                                            step: 15,
                                            max: 2500,
                                            min: 0,
                                        },
                                    }}
                                />
                            </div>
                        )}
                        <div style={{ marginTop: 10 }}>
                            <Button
                                variant="outlined"
                                onClick={() => connectToGoogleCalandar()}
                            >
                                התחבר ל-Google Calandar
                            </Button>
                        </div>
                        <div style={{ marginTop: 10 }}>
                            <Button
                                variant="outlined"
                                endIcon={<Save style={{ marginRight: 10 }} />}
                                onClick={() => saveSettings()}
                            >
                                שמור הגדרות
                            </Button>
                        </div>
                        {/* <TextField multiline maxRows={6} placeholder="פניה חופשית לבוט"/>
                        <Button style={{marginTop: 10, color: "#f3f3f3"}} variant="contained">שלח פניה</Button> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

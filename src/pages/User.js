import { Update, CalendarToday, Notifications } from "@mui/icons-material";
import { Box, Container, Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import config from "../config";
import { useLanguage } from "../contexts/LanguageContext";
import UserProfile from "../components/UserPage/UserProfile";
import MessageScheduler from "../components/UserPage/MessageScheduler";
import BotSettings from "../components/UserPage/BotSettings";
import { useSnackbar } from "../contexts/SnackbarContext";

export default function UserPage() {
    const [user, setUser] = useState(null);
    const [qrCode, setQrCode] = useState(null);
    const [isInSession, setIsInSession] = useState(false);
    const { phoneNum } = useParams();
    const { translations } = useLanguage();
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [scheduleDate, setScheduleDate] = useState(new Date());
    const [scheduleType, setScheduleType] = useState("once");
    const [scheduleMessage, setScheduleMessage] = useState("");
    const [contacts, setContacts] = useState([]);
    const [loadingContacts, setLoadingContacts] = useState(false);
    const [loadingWeeklyUpdate, setLoadingWeeklyUpdate] = useState(false);
    const { showSnackbar } = useSnackbar();

    const botSettings = [
        {
            id: "1",
            text: translations.weeklySummary,
            icon: <Update />,
        },
        {
            id: "2",
            text: translations.dailyUpdate,
            icon: <Update />,
        },
        {
            id: "3",
            text: translations.googleCalendar,
            icon: <CalendarToday />,
        },
        {
            id: "4",
            text: translations.eventNotifications,
            icon: <Notifications />,
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
            }
        };

        fetchUser();
    }, [phoneNum]);

    useEffect(() => {
        const fetchContacts = async () => {
            if (!user?._id) return;

            setLoadingContacts(true);
            try {
                const response = await fetch(
                    `${config.API_BASE_URL}/getContacts/${user._id}`
                );
                const data = await response.json();

                if (data.success) {
                    setContacts(data.contacts);
                } else {
                    console.error("Failed to fetch contacts:", data.error);
                }
            } catch (error) {
                console.error("Error fetching contacts:", error);
            } finally {
                setLoadingContacts(false);
            }
        };

        fetchContacts();
    }, [user?._id]);

    const getSummery = async () => {
        setLoadingWeeklyUpdate(true);
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
                showSnackbar(
                    translations.weeklyUpdateSuccess ||
                        "Weekly update retrieved successfully",
                    "success"
                );
            }
        } catch (error) {
            console.error("Error making bot request:", error);
            showSnackbar(
                translations.weeklyUpdateError ||
                    "Error retrieving weekly update",
                "error"
            );
        } finally {
            setLoadingWeeklyUpdate(false);
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
                showSnackbar(
                    translations.settingsSaved || "Settings saved successfully",
                    "success"
                );
            }
        } catch (error) {
            console.error("Error updating user:", error);
            showSnackbar(
                translations.settingsError || "Error saving settings",
                "error"
            );
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

    const handleScheduleSubmit = async () => {
        try {
            const response = await fetch(
                `${config.API_BASE_URL}/scheduleMessage`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userID: user._id,
                        contacts: selectedContacts.map((id) => {
                            const contact = contacts.find((c) => c.id === id);
                            return {
                                id: contact.id,
                                name: contact.name,
                                isGroup: contact.isGroup,
                            };
                        }),
                        dateTime: scheduleDate.toISOString(),
                        message: scheduleMessage,
                        frequency: scheduleType,
                    }),
                }
            );

            const data = await response.json();
            if (data.success) {
                setSelectedContacts([]);
                setScheduleDate(new Date());
                setScheduleType("once");
                setScheduleMessage("");
                showSnackbar(translations.messageScheduled, "success");
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error("Error scheduling message:", error);
            showSnackbar(translations.scheduleError, "error");
        }
    };

    const handleDeleteMessage = async (messageId) => {
        try {
            const updatedUser = {
                ...user,
                scheduledMessages: user.scheduledMessages.filter(
                    (msg) => msg.id !== messageId
                ),
            };

            const response = await fetch(`${config.API_BASE_URL}/editUser`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedUser),
            });

            const data = await response.json();
            if (data.success) {
                setUser(updatedUser);
                showSnackbar(translations.messageDeleted, "success");
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error("Error deleting message:", error);
            showSnackbar(translations.deleteError, "error");
        }
    };

    return (
        <Box
            sx={{
                height: "100vh",
                background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                p: 3,
                boxSizing: "border-box",
                overflow: "auto",
            }}
        >
            <Container
                maxWidth="lg"
                sx={{
                    height: "100%",
                    maxHeight: "calc(100vh - 48px)",
                    width: "100%",
                    px: 2,
                }}
            >
                <Grid
                    container
                    spacing={3}
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "nowrap",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        gap: 3,
                        width: "100%",
                        height: "100%",
                        maxHeight: "100%",
                        overflowX: "auto",
                        pb: 2,
                    }}
                >
                    <Grid
                        item
                        sx={{
                            flex: 1,
                            minWidth: "320px",
                            maxWidth: "400px",
                        }}
                    >
                        <UserProfile
                            user={user}
                            isInSession={isInSession}
                            qrCode={qrCode}
                            onGetSummary={getSummery}
                            loadingWeeklyUpdate={loadingWeeklyUpdate}
                        />
                    </Grid>

                    <Grid
                        item
                        sx={{
                            flex: 1,
                            minWidth: "320px",
                            maxWidth: "400px",
                        }}
                    >
                        <MessageScheduler
                            contacts={contacts}
                            loadingContacts={loadingContacts}
                            selectedContacts={selectedContacts}
                            setSelectedContacts={setSelectedContacts}
                            scheduleDate={scheduleDate}
                            setScheduleDate={setScheduleDate}
                            scheduleType={scheduleType}
                            setScheduleType={setScheduleType}
                            scheduleMessage={scheduleMessage}
                            setScheduleMessage={setScheduleMessage}
                            onScheduleSubmit={handleScheduleSubmit}
                            user={user}
                            onDeleteMessage={handleDeleteMessage}
                        />
                    </Grid>

                    <Grid
                        item
                        sx={{
                            flex: 1,
                            minWidth: "320px",
                            maxWidth: "400px",
                        }}
                    >
                        <BotSettings
                            user={user}
                            setUser={setUser}
                            botSettings={botSettings}
                            onChangeSettings={changeSettings}
                            onSaveSettings={saveSettings}
                            onConnectGoogleCalendar={connectToGoogleCalendar}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

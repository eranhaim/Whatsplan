import { Update, CalendarToday, Notifications } from "@mui/icons-material";
import { Box, Container, Grid, useTheme, useMediaQuery } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import config from "../config";
import { useLanguage } from "../contexts/LanguageContext";
import UserProfile from "../components/UserPage/UserProfile";
import BotSettings from "../components/UserPage/BotSettings";
import { useSnackbar } from "../contexts/SnackbarContext";
import GroupSelector from "../components/UserPage/GroupSelector";

export default function UserPage() {
    const [user, setUser] = useState(null);
    const [qrCode, setQrCode] = useState(null);
    const [isInSession, setIsInSession] = useState(false);
    const { phoneNum } = useParams();
    const { translations } = useLanguage();
    const [loadingWeeklyUpdate, setLoadingWeeklyUpdate] = useState(false);
    const [loadingDailyUpdate, setLoadingDailyUpdate] = useState(false);
    const [loadingMonthlyEvents, setLoadingMonthlyEvents] = useState(false);
    const { showSnackbar } = useSnackbar();
    const [groups, setGroups] = useState([]);
    const [loadingGroups, setLoadingGroups] = useState(false);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchUser();
    }, [phoneNum]);

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

    useEffect(() => {
        const fetchGroups = async () => {
            if (!user?._id) return;
            setLoadingGroups(true);
            try {
                const response = await fetch(
                    `${config.API_BASE_URL}/getGroupChats/${user._id}`,
                    {
                        method: "GET",
                        headers: {
                            "ngrok-skip-browser-warning": "true",
                        },
                    }
                );
                const data = await response.json();
                if (data.success) {
                    setGroups(data.groups);
                } else {
                    console.error("Failed to fetch groups:", data.error);
                }
            } catch (error) {
                console.error("Error fetching groups:", error);
            } finally {
                setLoadingGroups(false);
            }
        };
        fetchGroups();
    }, [user?._id]);

    useEffect(() => {
        if (user?.groupChatExceptions) {
            setSelectedGroups(user.groupChatExceptions);
        }
    }, [user]);

    const getSummery = async () => {
        setLoadingWeeklyUpdate(true);
        try {
            const response = await fetch(
                `${config.API_BASE_URL}/getWeeklyEvents`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "ngrok-skip-browser-warning": "true",
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

    const handleGetDailyUpdate = async () => {
        try {
            setLoadingDailyUpdate(true);
            const response = await fetch(
                `${config.API_BASE_URL}/getDailyEvents`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "ngrok-skip-browser-warning": "true",
                    },
                    body: JSON.stringify({
                        userID: user._id,
                    }),
                }
            );

            const data = await response.json();
            if (data.success) {
                showSnackbar(translations.dailyUpdate, "success");
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error("Error getting daily update:", error);
            showSnackbar(translations.error, "error");
        } finally {
            setLoadingDailyUpdate(false);
        }
    };

    const handleGetMonthlyEvents = async () => {
        try {
            setLoadingMonthlyEvents(true);
            const response = await fetch(
                `${config.API_BASE_URL}/getMonthlyEvents`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "ngrok-skip-browser-warning": "true",
                    },
                    body: JSON.stringify({
                        userID: user._id,
                    }),
                }
            );

            const data = await response.json();
            if (data.success) {
                showSnackbar(translations.getMonthlyEvents, "success");
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error("Error getting monthly events:", error);
            showSnackbar(translations.error, "error");
        } finally {
            setLoadingMonthlyEvents(false);
        }
    };

    const changeSettings = async (id) => {
        // If enabling Google Calendar integration
        if (id === "3" && !user.settingsFlags?.includes(id)) {
            // Initiate Google Calendar connection
            try {
                const response = await fetch(
                    `${config.API_BASE_URL}/initiateGoogleAuth?userID=${user._id}`,
                    {
                        method: "GET",
                        headers: {
                            "ngrok-skip-browser-warning": "true",
                        },
                    }
                );
                const data = await response.json();
                if (data.authUrl) {
                    window.location.href = data.authUrl;
                    return; // Don't update settings until auth is complete
                }
            } catch (error) {
                console.error("Error initiating Google auth:", error);
                showSnackbar("Failed to connect to Google Calendar", "error");
                return;
            }
        }

        // For all other settings or when disabling Google Calendar
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
                    "ngrok-skip-browser-warning": "true",
                },
                body: JSON.stringify({
                    _id: user._id,
                    settingsFlags: user.settingsFlags,
                    settings: user.settings,
                }),
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

    const saveGroupExceptions = async () => {
        try {
            const response = await fetch(`${config.API_BASE_URL}/editUser`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
                body: JSON.stringify({
                    _id: user._id,
                    groupChatExceptions: selectedGroups,
                }),
            });
            const data = await response.json();
            if (data.success) {
                setUser({ ...user, groupChatExceptions: selectedGroups });
                showSnackbar(
                    translations.settingsSaved || "Settings saved successfully",
                    "success"
                );
            }
        } catch (error) {
            console.error("Error saving group exceptions:", error);
            showSnackbar(
                translations.settingsError || "Error saving settings",
                "error"
            );
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
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
                        flexWrap: { xs: "wrap", md: "nowrap" },
                        justifyContent: "center",
                        alignItems: "flex-start",
                        gap: { xs: 2, md: 3 },
                        width: "100%",
                        pb: 2,
                    }}
                >
                    <Grid
                        item
                        xs={12}
                        md="auto"
                        sx={{
                            flex: { md: 1 },
                            width: "100%",
                            minWidth: { md: "300px" },
                            maxWidth: { xs: "100%", md: "400px" },
                        }}
                    >
                        <UserProfile
                            user={user}
                            isInSession={isInSession}
                            qrCode={qrCode}
                            onGetSummary={getSummery}
                            onGetDailyUpdate={handleGetDailyUpdate}
                            onGetMonthlyEvents={handleGetMonthlyEvents}
                            loadingWeeklyUpdate={loadingWeeklyUpdate}
                            loadingDailyUpdate={loadingDailyUpdate}
                            loadingMonthlyEvents={loadingMonthlyEvents}
                        />
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md="auto"
                        sx={{
                            flex: { md: 1 },
                            width: "100%",
                            minWidth: { md: "300px" },
                            maxWidth: { xs: "100%", md: "400px" },
                        }}
                    >
                        <GroupSelector
                            groups={groups}
                            loadingGroups={loadingGroups}
                            selectedGroups={selectedGroups}
                            setSelectedGroups={setSelectedGroups}
                            onSave={saveGroupExceptions}
                            translations={translations}
                        />
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md="auto"
                        sx={{
                            flex: { md: 1 },
                            width: "100%",
                            minWidth: { md: "300px" },
                            maxWidth: { xs: "100%", md: "400px" },
                        }}
                    >
                        <BotSettings
                            user={user}
                            setUser={setUser}
                            botSettings={botSettings}
                            onChangeSettings={changeSettings}
                            onSaveSettings={saveSettings}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

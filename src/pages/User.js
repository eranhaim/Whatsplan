import {
    Check,
    Save,
    Settings,
    CalendarToday,
    Notifications,
    Update,
    Schedule,
    Person,
    Group,
} from "@mui/icons-material";
import {
    Button,
    Checkbox,
    LinearProgress,
    TextField,
    Typography,
    Box,
    Paper,
    Container,
    Grid,
    Card,
    CardContent,
    CardHeader,
    Divider,
    IconButton,
    Tooltip,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Avatar,
    ListItemAvatar,
    ListItemText,
    Chip,
    RadioGroup,
    FormControlLabel,
    Radio,
    CircularProgress,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import config from "../config";
import { useLanguage } from "../contexts/LanguageContext";
import moment from "moment";

export default function UserPage() {
    const [user, setUser] = useState(null);
    const [qrCode, setQrCode] = useState(null);
    const [isInSession, setIsInSession] = useState(false);
    const { phoneNum } = useParams();
    const { translations, language } = useLanguage();
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [scheduleDate, setScheduleDate] = useState(new Date());
    const [scheduleType, setScheduleType] = useState("once");
    const [scheduleMessage, setScheduleMessage] = useState("");
    const [contacts, setContacts] = useState([]);
    const [loadingContacts, setLoadingContacts] = useState(false);

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
                alert(
                    translations.messageScheduled ||
                        "Message scheduled successfully"
                );
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error("Error scheduling message:", error);
            alert(translations.scheduleError || "Error scheduling message");
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
                                            }}
                                        >
                                            {!qrCode && <LinearProgress />}
                                            {qrCode && (
                                                <img
                                                    src={qrCode}
                                                    alt="QR Code"
                                                    style={{
                                                        width: "100%",
                                                        height: "auto",
                                                        borderRadius: "8px",
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    )}
                                </Box>

                                <Button
                                    variant="contained"
                                    onClick={getSummery}
                                    sx={{
                                        bgcolor: "#128C7E",
                                        color: "white",
                                        "&:hover": {
                                            bgcolor: "#00A884",
                                        },
                                        width: "100%",
                                        py: 1.5,
                                        borderRadius: "50px",
                                    }}
                                >
                                    {translations.getWeeklyUpdate}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid
                        item
                        sx={{
                            flex: 1,
                            minWidth: "320px",
                            maxWidth: "400px",
                        }}
                    >
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
                            <CardHeader
                                title={
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: "bold",
                                            color: "#128C7E",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                        }}
                                    >
                                        <Schedule />
                                        {translations.scheduleMessage ||
                                            "Schedule Message"}
                                    </Typography>
                                }
                            />
                            <Divider />
                            <CardContent>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 3,
                                    }}
                                >
                                    <FormControl fullWidth>
                                        <InputLabel>
                                            {translations.selectContacts ||
                                                "Select Contacts"}
                                        </InputLabel>
                                        <Select
                                            multiple
                                            value={selectedContacts}
                                            onChange={(e) =>
                                                setSelectedContacts(
                                                    e.target.value
                                                )
                                            }
                                            renderValue={(selected) => (
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        flexWrap: "wrap",
                                                        gap: 0.5,
                                                    }}
                                                >
                                                    {selected.map((value) => (
                                                        <Chip
                                                            key={value}
                                                            label={
                                                                contacts.find(
                                                                    (c) =>
                                                                        c.id ===
                                                                        value
                                                                )?.name
                                                            }
                                                            sx={{
                                                                bgcolor:
                                                                    "#128C7E",
                                                                color: "white",
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                            )}
                                        >
                                            {loadingContacts ? (
                                                <MenuItem disabled>
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            gap: 1,
                                                        }}
                                                    >
                                                        <CircularProgress
                                                            size={20}
                                                        />
                                                        {translations.loadingContacts ||
                                                            "Loading contacts..."}
                                                    </Box>
                                                </MenuItem>
                                            ) : contacts.length === 0 ? (
                                                <MenuItem disabled>
                                                    {translations.noContacts ||
                                                        "No contacts available"}
                                                </MenuItem>
                                            ) : (
                                                contacts.map((contact) => (
                                                    <MenuItem
                                                        key={contact.id}
                                                        value={contact.id}
                                                    >
                                                        <ListItemAvatar>
                                                            {contact.avatar ? (
                                                                <Avatar
                                                                    src={
                                                                        contact.avatar
                                                                    }
                                                                />
                                                            ) : (
                                                                <Avatar
                                                                    sx={{
                                                                        bgcolor:
                                                                            "#128C7E",
                                                                    }}
                                                                >
                                                                    <Person />
                                                                </Avatar>
                                                            )}
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={
                                                                contact.name
                                                            }
                                                            secondary={
                                                                contact.isGroup
                                                                    ? `${
                                                                          contact.participants
                                                                      } ${
                                                                          translations.participants ||
                                                                          "participants"
                                                                      }`
                                                                    : contact.lastSeen
                                                                    ? moment(
                                                                          contact.lastSeen
                                                                      ).fromNow()
                                                                    : ""
                                                            }
                                                        />
                                                    </MenuItem>
                                                ))
                                            )}
                                        </Select>
                                    </FormControl>

                                    <LocalizationProvider
                                        dateAdapter={AdapterDateFns}
                                    >
                                        <DateTimePicker
                                            label={
                                                translations.scheduleDateTime ||
                                                "Schedule Date & Time"
                                            }
                                            value={scheduleDate}
                                            onChange={(newValue) =>
                                                setScheduleDate(newValue)
                                            }
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    "&:hover fieldset": {
                                                        borderColor: "#128C7E",
                                                    },
                                                },
                                            }}
                                        />
                                    </LocalizationProvider>

                                    <FormControl>
                                        <RadioGroup
                                            row
                                            value={scheduleType}
                                            onChange={(e) =>
                                                setScheduleType(e.target.value)
                                            }
                                        >
                                            <FormControlLabel
                                                value="once"
                                                control={
                                                    <Radio
                                                        sx={{
                                                            color: "#128C7E",
                                                            "&.Mui-checked": {
                                                                color: "#128C7E",
                                                            },
                                                        }}
                                                    />
                                                }
                                                label={
                                                    translations.once || "Once"
                                                }
                                            />
                                            <FormControlLabel
                                                value="daily"
                                                control={
                                                    <Radio
                                                        sx={{
                                                            color: "#128C7E",
                                                            "&.Mui-checked": {
                                                                color: "#128C7E",
                                                            },
                                                        }}
                                                    />
                                                }
                                                label={
                                                    translations.daily ||
                                                    "Daily"
                                                }
                                            />
                                            <FormControlLabel
                                                value="weekly"
                                                control={
                                                    <Radio
                                                        sx={{
                                                            color: "#128C7E",
                                                            "&.Mui-checked": {
                                                                color: "#128C7E",
                                                            },
                                                        }}
                                                    />
                                                }
                                                label={
                                                    translations.weekly ||
                                                    "Weekly"
                                                }
                                            />
                                            <FormControlLabel
                                                value="monthly"
                                                control={
                                                    <Radio
                                                        sx={{
                                                            color: "#128C7E",
                                                            "&.Mui-checked": {
                                                                color: "#128C7E",
                                                            },
                                                        }}
                                                    />
                                                }
                                                label={
                                                    translations.monthly ||
                                                    "Monthly"
                                                }
                                            />
                                        </RadioGroup>
                                    </FormControl>

                                    <TextField
                                        multiline
                                        rows={4}
                                        value={scheduleMessage}
                                        onChange={(e) =>
                                            setScheduleMessage(e.target.value)
                                        }
                                        label={
                                            translations.message || "Message"
                                        }
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
                                        onClick={handleScheduleSubmit}
                                        sx={{
                                            bgcolor: "#128C7E",
                                            color: "white",
                                            "&:hover": {
                                                bgcolor: "#00A884",
                                            },
                                            py: 1.5,
                                            borderRadius: "50px",
                                        }}
                                    >
                                        {translations.scheduleMessage ||
                                            "Schedule Message"}
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid
                        item
                        sx={{
                            flex: 1,
                            minWidth: "320px",
                            maxWidth: "400px",
                        }}
                    >
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
                            <CardHeader
                                title={
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: "bold",
                                            color: "#128C7E",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                        }}
                                    >
                                        <Settings />
                                        {translations.botSettings}
                                    </Typography>
                                }
                            />
                            <Divider />
                            <CardContent>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 3,
                                    }}
                                >
                                    {botSettings.map((item) => (
                                        <Box
                                            key={item.id}
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 2,
                                                p: 2,
                                                borderRadius: 1,
                                                bgcolor: "background.paper",
                                                boxShadow:
                                                    "0 2px 8px rgba(0,0,0,0.05)",
                                            }}
                                        >
                                            <Tooltip title={item.text}>
                                                <IconButton
                                                    sx={{
                                                        color: user?.settingsFlags?.includes(
                                                            item.id
                                                        )
                                                            ? "#128C7E"
                                                            : "text.secondary",
                                                    }}
                                                >
                                                    {item.icon}
                                                </IconButton>
                                            </Tooltip>
                                            <Typography sx={{ flex: 1 }}>
                                                {item.text}
                                            </Typography>
                                            <Checkbox
                                                checked={
                                                    user?.settingsFlags?.includes(
                                                        item.id
                                                    ) || false
                                                }
                                                onChange={() =>
                                                    changeSettings(item.id)
                                                }
                                                sx={{
                                                    color: "#128C7E",
                                                    "&.Mui-checked": {
                                                        color: "#128C7E",
                                                    },
                                                }}
                                            />
                                        </Box>
                                    ))}

                                    {user?.settingsFlags?.includes("4") && (
                                        <TextField
                                            value={
                                                user?.settings
                                                    ?.timeBeforeEventNotification ||
                                                ""
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
                                            label={
                                                translations.minutesBeforeEvent
                                            }
                                            inputProps={{
                                                step: 15,
                                                max: 2500,
                                                min: 0,
                                            }}
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    "&:hover fieldset": {
                                                        borderColor: "#128C7E",
                                                    },
                                                },
                                            }}
                                        />
                                    )}

                                    <Button
                                        variant="outlined"
                                        onClick={connectToGoogleCalendar}
                                        sx={{
                                            borderColor: "#128C7E",
                                            color: "#128C7E",
                                            "&:hover": {
                                                borderColor: "#00A884",
                                                bgcolor: "rgba(0,168,132,0.04)",
                                                color: "#00A884",
                                            },
                                            py: 1.5,
                                            borderRadius: "50px",
                                        }}
                                    >
                                        {translations.connectGoogleCalendar}
                                    </Button>

                                    <Button
                                        variant="contained"
                                        endIcon={<Save />}
                                        onClick={saveSettings}
                                        sx={{
                                            bgcolor: "#128C7E",
                                            color: "white",
                                            "&:hover": {
                                                bgcolor: "#00A884",
                                            },
                                            py: 1.5,
                                            borderRadius: "50px",
                                        }}
                                    >
                                        {translations.saveSettings}
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

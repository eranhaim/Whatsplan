import { Settings, Save } from "@mui/icons-material";
import {
    Typography,
    Box,
    Card,
    CardContent,
    CardHeader,
    Divider,
    IconButton,
    Tooltip,
    Checkbox,
    TextField,
    Button,
} from "@mui/material";
import { useLanguage } from "../../contexts/LanguageContext";

export default function BotSettings({
    user,
    setUser,
    botSettings,
    onChangeSettings,
    onSaveSettings,
}) {
    const { translations } = useLanguage();

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
                                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
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
                                    user?.settingsFlags?.includes(item.id) ||
                                    false
                                }
                                onChange={() => onChangeSettings(item.id)}
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
                                user?.settings?.timeBeforeEventNotification ||
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
                            label={translations.minutesBeforeEvent}
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
                        variant="contained"
                        endIcon={<Save />}
                        onClick={onSaveSettings}
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
    );
}

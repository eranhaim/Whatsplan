import { Schedule, Delete, Edit } from "@mui/icons-material";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List as MuiList,
    ListItem,
    ListItemText,
    IconButton,
    Button,
    Typography,
    Box,
} from "@mui/material";
import { useLanguage } from "../../contexts/LanguageContext";

export default function ScheduledMessagesDialog({
    open,
    onClose,
    scheduledMessages,
    onDeleteMessage,
    onEditMessage,
}) {
    const { translations } = useLanguage();

    const getTranslatedFrequency = (frequency) => {
        const frequencyMap = {
            once: translations.once,
            daily: translations.daily,
            weekly: translations.weekly,
            monthly: translations.monthly,
        };
        return frequencyMap[frequency] || frequency;
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Typography
                    variant="h6"
                    sx={{
                        color: "#128C7E",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <Schedule />
                    {translations.scheduledMessages}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <MuiList>
                    {scheduledMessages?.length === 0 ? (
                        <ListItem>
                            <ListItemText
                                primary={translations.noScheduledMessages}
                            />
                        </ListItem>
                    ) : (
                        scheduledMessages?.map((message) => (
                            <ListItem
                                key={message._id}
                                secondaryAction={
                                    <Box sx={{ display: "flex", gap: 1 }}>
                                        <IconButton
                                            edge="end"
                                            onClick={() =>
                                                onEditMessage(message)
                                            }
                                            sx={{ color: "#128C7E" }}
                                        >
                                            <Edit />
                                        </IconButton>
                                        <IconButton
                                            edge="end"
                                            onClick={() =>
                                                onDeleteMessage(message.id)
                                            }
                                            sx={{ color: "#128C7E" }}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Box>
                                }
                            >
                                <ListItemText
                                    primary={message.message}
                                    secondary={
                                        <>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                            >
                                                {new Date(
                                                    message.dateTime
                                                ).toLocaleString()}
                                            </Typography>
                                            <br />
                                            <Typography
                                                component="span"
                                                variant="body2"
                                            >
                                                {translations.contacts}:{" "}
                                                {message.contacts
                                                    .map((c) => c.name)
                                                    .join(", ")}
                                            </Typography>
                                            <br />
                                            <Typography
                                                component="span"
                                                variant="body2"
                                            >
                                                {translations.frequency}:{" "}
                                                {getTranslatedFrequency(
                                                    message.frequency
                                                )}
                                            </Typography>
                                        </>
                                    }
                                />
                            </ListItem>
                        ))
                    )}
                </MuiList>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                    sx={{
                        color: "#128C7E",
                        "&:hover": {
                            bgcolor: "rgba(0,168,132,0.04)",
                        },
                    }}
                >
                    {translations.close}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

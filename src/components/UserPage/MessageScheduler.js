import { Schedule, Person, List } from "@mui/icons-material";
import {
    Typography,
    Box,
    Card,
    CardContent,
    CardHeader,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Chip,
    CircularProgress,
    Button,
    TextField,
    FormControlLabel,
    Radio,
    RadioGroup,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List as MuiList,
    ListItem,
    IconButton,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { useLanguage } from "../../contexts/LanguageContext";
import moment from "moment";
import { useState } from "react";
import { Delete } from "@mui/icons-material";
import ScheduledMessagesDialog from "./ScheduledMessagesDialog";

export default function MessageScheduler({
    contacts,
    loadingContacts,
    selectedContacts,
    setSelectedContacts,
    scheduleDate,
    setScheduleDate,
    scheduleType,
    setScheduleType,
    scheduleMessage,
    setScheduleMessage,
    onScheduleSubmit,
    user,
    onDeleteMessage,
}) {
    const { translations } = useLanguage();
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
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
                        {translations.scheduleMessage || "Schedule Message"}
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
                    <Button
                        variant="outlined"
                        startIcon={<List />}
                        onClick={handleOpenDialog}
                        sx={{
                            borderColor: "#128C7E",
                            color: "#128C7E",
                            "&:hover": {
                                borderColor: "#00A884",
                                bgcolor: "rgba(0,168,132,0.04)",
                            },
                            alignSelf: "flex-start",
                        }}
                    >
                        {translations.viewScheduledMessages ||
                            "View Scheduled Messages"}
                    </Button>

                    <FormControl fullWidth>
                        <InputLabel>{translations.selectContacts}</InputLabel>
                        <Select
                            multiple
                            value={selectedContacts}
                            onChange={(e) =>
                                setSelectedContacts(e.target.value)
                            }
                            disabled={loadingContacts}
                            renderValue={(selected) => (
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 0.5,
                                    }}
                                >
                                    {selected.map((value) => {
                                        const contact = contacts.find(
                                            (c) => c.id === value
                                        );
                                        return (
                                            <Chip
                                                key={value}
                                                label={contact?.name || value}
                                                sx={{
                                                    bgcolor: "#128C7E",
                                                    color: "white",
                                                    "& .MuiChip-deleteIcon": {
                                                        color: "white",
                                                    },
                                                }}
                                                onDelete={() => {
                                                    setSelectedContacts(
                                                        selectedContacts.filter(
                                                            (id) => id !== value
                                                        )
                                                    );
                                                }}
                                            />
                                        );
                                    })}
                                </Box>
                            )}
                        >
                            {loadingContacts ? (
                                <MenuItem disabled>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                        }}
                                    >
                                        <CircularProgress size={20} />
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
                                                <Avatar src={contact.avatar} />
                                            ) : (
                                                <Avatar
                                                    sx={{
                                                        bgcolor: "#128C7E",
                                                    }}
                                                >
                                                    <Person />
                                                </Avatar>
                                            )}
                                        </ListItemAvatar>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                            }}
                                        >
                                            <Typography>
                                                {contact.name}
                                            </Typography>
                                            {contact.lastSeen && (
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    {moment(
                                                        contact.lastSeen
                                                    ).fromNow()}
                                                </Typography>
                                            )}
                                        </Box>
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                    </FormControl>

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            label={
                                translations.scheduleDateTime ||
                                "Schedule Date & Time"
                            }
                            value={scheduleDate}
                            onChange={(newValue) => setScheduleDate(newValue)}
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
                            onChange={(e) => setScheduleType(e.target.value)}
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
                                label={translations.once || "Once"}
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
                                label={translations.daily || "Daily"}
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
                                label={translations.weekly || "Weekly"}
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
                                label={translations.monthly || "Monthly"}
                            />
                        </RadioGroup>
                    </FormControl>

                    <TextField
                        multiline
                        rows={4}
                        value={scheduleMessage}
                        onChange={(e) => setScheduleMessage(e.target.value)}
                        label={translations.message || "Message"}
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
                        onClick={onScheduleSubmit}
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
                        {translations.scheduleMessage || "Schedule Message"}
                    </Button>
                </Box>
            </CardContent>

            <ScheduledMessagesDialog
                open={openDialog}
                onClose={handleCloseDialog}
                scheduledMessages={user?.scheduledMessages}
                onDeleteMessage={onDeleteMessage}
            />
        </Card>
    );
}

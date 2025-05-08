import React from "react";
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    ListItemAvatar,
    Avatar,
    Chip,
    CircularProgress,
    Button,
    Typography,
    Card,
    CardContent,
    CardHeader,
    Divider,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";

export default function GroupSelector({
    groups = [],
    loadingGroups = false,
    selectedGroups = [],
    setSelectedGroups,
    onSave,
    translations = {},
}) {
    return (
        <Card
            sx={{
                borderRadius: 2,
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                mt: 3,
                mb: 1,
            }}
        >
            <CardHeader
                title={
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: "bold",
                            color: "#128C7E",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <GroupIcon />
                        {translations.selectGroupExceptions ||
                            "Select Group Exceptions"}
                    </Typography>
                }
            />
            <Divider />
            <CardContent>
                <FormControl fullWidth>
                    <InputLabel>
                        {translations.selectGroups || "Select Groups"}
                    </InputLabel>
                    <Select
                        multiple
                        value={selectedGroups}
                        onChange={(e) => setSelectedGroups(e.target.value)}
                        disabled={loadingGroups}
                        renderValue={(selected) => (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 0.5,
                                }}
                            >
                                {selected.map((value) => {
                                    const group = groups.find(
                                        (g) => g.id === value
                                    );
                                    return (
                                        <Chip
                                            key={value}
                                            label={group?.name || value}
                                            sx={{
                                                bgcolor: "#128C7E",
                                                color: "white",
                                                "& .MuiChip-deleteIcon": {
                                                    color: "white",
                                                },
                                            }}
                                            avatar={
                                                group?.avatar ? (
                                                    <Avatar
                                                        src={group.avatar}
                                                    />
                                                ) : (
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: "#128C7E",
                                                        }}
                                                    >
                                                        <GroupIcon />
                                                    </Avatar>
                                                )
                                            }
                                            onDelete={() => {
                                                setSelectedGroups(
                                                    selectedGroups.filter(
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
                        {loadingGroups ? (
                            <MenuItem disabled>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <CircularProgress size={20} />
                                    {translations.loadingGroups ||
                                        "Loading groups..."}
                                </Box>
                            </MenuItem>
                        ) : groups.length === 0 ? (
                            <MenuItem disabled>
                                {translations.noGroups || "No groups found"}
                            </MenuItem>
                        ) : (
                            groups.map((group) => (
                                <MenuItem key={group.id} value={group.id}>
                                    <ListItemAvatar>
                                        {group.avatar ? (
                                            <Avatar src={group.avatar} />
                                        ) : (
                                            <Avatar sx={{ bgcolor: "#128C7E" }}>
                                                <GroupIcon />
                                            </Avatar>
                                        )}
                                    </ListItemAvatar>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                    >
                                        <Typography>{group.name}</Typography>
                                    </Box>
                                </MenuItem>
                            ))
                        )}
                    </Select>
                </FormControl>
                <Button
                    variant="contained"
                    onClick={onSave}
                    sx={{
                        bgcolor: "#128C7E",
                        color: "white",
                        mt: 2,
                        borderRadius: "50px",
                        py: 1.2,
                        px: 4,
                        fontWeight: "bold",
                        "&:hover": { bgcolor: "#00A884" },
                    }}
                >
                    {translations.saveGroups || "Save Groups"}
                </Button>
            </CardContent>
        </Card>
    );
}

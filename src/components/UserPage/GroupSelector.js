import {
    Box,
    FormControl,
    Select,
    MenuItem,
    ListItemAvatar,
    Avatar,
    Chip,
    CircularProgress,
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
                mb: 1,
                height: "100%",
            }}
        >
            <CardHeader
                sx={{ textAlign: "center" }}
                title={
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: "bold",
                            color: "#128C7E",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
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
            <CardContent sx={{ textAlign: "center" }}>
                <Box
                    sx={{ mb: 1.5, display: "flex", justifyContent: "center" }}
                >
                    <Typography
                        variant="subtitle2"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 0.8,
                            color: "#128C7E",
                            fontWeight: 500,
                            fontSize: "0.875rem",
                            mb: 0.5,
                        }}
                    >
                        {translations.selectGroups || "Select Groups"}
                    </Typography>
                </Box>

                <FormControl fullWidth>
                    <Select
                        multiple
                        value={selectedGroups}
                        onChange={(e) => {
                            setSelectedGroups(e.target.value);
                            onSave();
                        }}
                        disabled={loadingGroups}
                        displayEmpty
                        placeholder={
                            translations.selectGroups || "Select Groups"
                        }
                        sx={{
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "rgba(18, 140, 126, 0.3)",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "rgba(18, 140, 126, 0.6)",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#128C7E",
                            },
                        }}
                        renderValue={(selected) => (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "center",
                                    gap: 0.5,
                                }}
                            >
                                {selected.length === 0 ? (
                                    <Typography
                                        sx={{
                                            color: "text.secondary",
                                            fontStyle: "italic",
                                            textAlign: "center",
                                        }}
                                    >
                                        {translations.selectGroups ||
                                            "Select Groups"}
                                    </Typography>
                                ) : (
                                    selected.map((value) => {
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
                                                                bgcolor:
                                                                    "#128C7E",
                                                            }}
                                                        >
                                                            <GroupIcon />
                                                        </Avatar>
                                                    )
                                                }
                                                onDelete={() => {
                                                    const newSelection =
                                                        selectedGroups.filter(
                                                            (id) => id !== value
                                                        );
                                                    setSelectedGroups(
                                                        newSelection
                                                    );
                                                    onSave();
                                                }}
                                            />
                                        );
                                    })
                                )}
                            </Box>
                        )}
                    >
                        {loadingGroups ? (
                            <MenuItem disabled>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "100%",
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
            </CardContent>
        </Card>
    );
}

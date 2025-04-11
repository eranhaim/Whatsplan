import { Check } from "@mui/icons-material";
import {
    Typography,
    Box,
    Card,
    CardContent,
    Button,
    LinearProgress,
} from "@mui/material";
import { useLanguage } from "../../contexts/LanguageContext";

export default function UserProfile({
    user,
    isInSession,
    qrCode,
    onGetSummary,
    loadingWeeklyUpdate,
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

                <Box sx={{ width: "100%" }}>
                    {loadingWeeklyUpdate && (
                        <LinearProgress
                            sx={{
                                mb: 2,
                                "& .MuiLinearProgress-bar": {
                                    backgroundColor: "#128C7E",
                                },
                            }}
                        />
                    )}
                    <Button
                        variant="contained"
                        onClick={onGetSummary}
                        disabled={loadingWeeklyUpdate}
                        sx={{
                            bgcolor: "#128C7E",
                            color: "white",
                            "&:hover": {
                                bgcolor: "#00A884",
                            },
                            "&:disabled": {
                                bgcolor: "#cccccc",
                                color: "#666666",
                            },
                            width: "100%",
                            py: 1.5,
                            borderRadius: "50px",
                        }}
                    >
                        {translations.getWeeklyUpdate}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}

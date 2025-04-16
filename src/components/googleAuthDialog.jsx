// components/GoogleAuthDialog.jsx
import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Alert,
} from "@mui/material";
import config from "../config";

const GoogleAuthDialog = ({ open, onClose, user }) => {
    const [error, setError] = React.useState(null);

    const handleAuthorize = async () => {
        try {
            setError(null);
            const response = await fetch(
                `${config.API_BASE_URL}/initiateGoogleAuth?userID=${user._id}`,
                {
                    method: "GET",
                    headers: {
                        "ngrok-skip-browser-warning": "true",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to initiate Google auth");
            }

            const { authUrl } = await response.json();
            window.location.href = authUrl;
        } catch (error) {
            console.error("Failed to initiate Google auth:", error);
            setError("Failed to connect to Google Calendar. Please try again.");
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Connect Google Calendar</DialogTitle>
            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <Typography>
                    To provide you with the best experience, we need access to
                    your Google Calendar. This will allow us to:
                </Typography>
                <ul>
                    <li>View your upcoming events</li>
                    <li>Help you manage your schedule</li>
                    <li>Provide personalized recommendations</li>
                </ul>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Not Now</Button>
                <Button
                    onClick={handleAuthorize}
                    variant="contained"
                    color="primary"
                >
                    Connect Google Calendar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default GoogleAuthDialog;

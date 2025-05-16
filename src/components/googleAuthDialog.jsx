// components/GoogleAuthDialog.jsx
import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Alert,
} from "@mui/material";
import config from "../config";

const GoogleAuthDialog = ({ open, onClose, user, forceConsent }) => {
    const [error, setError] = React.useState(null);

    const handleAuthorize = async () => {
        try {
            setError(null);
            // Build URL with optional forceConsent parameter
            let authUrl = `${config.API_BASE_URL}/initiateGoogleAuth?userID=${user._id}`;

            // Add forceConsent parameter if needed
            if (forceConsent) {
                authUrl += `&forceConsent=true`;
            }

            const response = await fetch(authUrl, {
                method: "GET",
                headers: {
                    "ngrok-skip-browser-warning": "true",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to initiate Google auth");
            }

            const { authUrl: redirectUrl } = await response.json();
            window.location.href = redirectUrl;
        } catch (error) {
            console.error("Failed to initiate Google auth:", error);
            setError("Failed to connect to Google Calendar. Please try again.");
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Google Calendar</DialogTitle>
            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                {forceConsent && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        Your previous Google Calendar access has expired. Please
                        reconnect to continue syncing events.
                    </Alert>
                )}
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

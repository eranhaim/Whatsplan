// pages/AuthError.jsx
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Typography, Button, Alert } from "@mui/material";

const AuthError = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const error = searchParams.get("error") || "An unknown error occurred";

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            gap={3}
            p={3}
            maxWidth="600px"
            mx="auto"
        >
            <Alert severity="error" sx={{ width: "100%" }}>
                {error}
            </Alert>
            <Typography variant="h5" textAlign="center">
                Failed to connect to Google Calendar
            </Typography>
            <Typography textAlign="center" color="text.secondary">
                There was an error connecting to your Google Calendar. You can
                try again later from your account settings.
            </Typography>
            <Button
                variant="contained"
                onClick={() => navigate("/dashboard")}
                sx={{ mt: 2 }}
            >
                Return to Dashboard
            </Button>
        </Box>
    );
};

export default AuthError;

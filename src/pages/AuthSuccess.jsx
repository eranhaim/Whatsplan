// pages/AuthSuccess.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";

const AuthSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            // Get the user's phone number from localStorage
            const userData = localStorage.getItem("user");
            if (userData) {
                const user = JSON.parse(userData);
                navigate(`/user/${user.phoneNum}`);
            } else {
                // Fallback to login if no user data found
                navigate("/login");
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            gap={2}
        >
            <CircularProgress />
            <Typography variant="h5">
                Successfully connected to Google Calendar!
            </Typography>
            <Typography>Redirecting you back to the app...</Typography>
        </Box>
    );
};

export default AuthSuccess;

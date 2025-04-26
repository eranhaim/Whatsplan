import React from "react";
import { Container, Typography, Box } from "@mui/material";

const PrivacyPolicy = () => {
    return (
        <Container maxWidth="md">
            <Box py={4}>
                <Typography variant="h3" component="h1" gutterBottom>
                    Privacy Policy
                </Typography>

                <Typography variant="body1" paragraph>
                    Last updated: {new Date().toLocaleDateString()}
                </Typography>

                <Typography variant="h5" gutterBottom>
                    1. Information We Collect
                </Typography>
                <Typography variant="body1" paragraph>
                    When you use WhatsPlan, we collect information that you
                    provide directly to us, including: - Google Calendar data
                    when you grant access - Email data when you grant access to
                    Gmail - Account information necessary for the service
                </Typography>

                <Typography variant="h5" gutterBottom>
                    2. How We Use Your Information
                </Typography>
                <Typography variant="body1" paragraph>
                    We use the information we collect to: - Provide, maintain,
                    and improve our services - Process and complete your
                    scheduling requests - Send you technical notices and support
                    messages - Respond to your comments and questions
                </Typography>

                <Typography variant="h5" gutterBottom>
                    3. Data Security
                </Typography>
                <Typography variant="body1" paragraph>
                    We implement appropriate security measures to protect your
                    personal information. However, no method of transmission
                    over the Internet is 100% secure.
                </Typography>

                <Typography variant="h5" gutterBottom>
                    4. Third-Party Services
                </Typography>
                <Typography variant="body1" paragraph>
                    We use Google Calendar and Gmail APIs. Your use of these
                    services is subject to their respective privacy policies.
                </Typography>

                <Typography variant="h5" gutterBottom>
                    5. Contact Us
                </Typography>
                <Typography variant="body1" paragraph>
                    If you have questions about this Privacy Policy, please
                    contact us at support@whatsplan.netlify.app
                </Typography>
            </Box>
        </Container>
    );
};

export default PrivacyPolicy;

import React from "react";
import { Container, Typography, Box } from "@mui/material";

const TermsOfService = () => {
    return (
        <Container maxWidth="md">
            <Box py={4}>
                <Typography variant="h3" component="h1" gutterBottom>
                    Terms of Service
                </Typography>

                <Typography variant="body1" paragraph>
                    Last updated: {new Date().toLocaleDateString()}
                </Typography>

                <Typography variant="h5" gutterBottom>
                    1. Acceptance of Terms
                </Typography>
                <Typography variant="body1" paragraph>
                    By accessing and using WhatsPlan, you accept and agree to be
                    bound by the terms and conditions of this agreement.
                </Typography>

                <Typography variant="h5" gutterBottom>
                    2. Description of Service
                </Typography>
                <Typography variant="body1" paragraph>
                    WhatsPlan is a scheduling automation service that integrates
                    with Google Calendar and Gmail to help users manage their
                    appointments and communications more efficiently.
                </Typography>

                <Typography variant="h5" gutterBottom>
                    3. Google API Services User Data Policy
                </Typography>
                <Typography variant="body1" paragraph>
                    Our application adheres to the Google API Services User Data
                    Policy, including the Limited Use requirements. We access,
                    use, and transfer user data only for the purposes that are
                    permitted by our users, and we provide a privacy policy and
                    terms of service that clearly describe how we use the data.
                </Typography>

                <Typography variant="h5" gutterBottom>
                    4. User Obligations
                </Typography>
                <Typography variant="body1" paragraph>
                    You agree to: - Provide accurate information - Maintain the
                    security of your account - Not use the service for any
                    illegal purposes - Not interfere with the service's
                    operation
                </Typography>

                <Typography variant="h5" gutterBottom>
                    5. Limitation of Liability
                </Typography>
                <Typography variant="body1" paragraph>
                    WhatsPlan is provided "as is" without any warranties. We are
                    not liable for any damages arising from your use of the
                    service.
                </Typography>

                <Typography variant="h5" gutterBottom>
                    6. Changes to Terms
                </Typography>
                <Typography variant="body1" paragraph>
                    We reserve the right to modify these terms at any time. We
                    will notify users of any material changes.
                </Typography>

                <Typography variant="h5" gutterBottom>
                    7. Contact Information
                </Typography>
                <Typography variant="body1" paragraph>
                    For questions about these Terms, please contact us at
                    support@whatsplan.netlify.app
                </Typography>
            </Box>
        </Container>
    );
};

export default TermsOfService;

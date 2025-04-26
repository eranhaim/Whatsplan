import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControlLabel,
    Checkbox,
    Typography,
    Box,
    IconButton,
    AppBar,
    Toolbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const LegalConsentDialogs = ({
    termsOpen,
    privacyOpen,
    termsAccepted,
    privacyAccepted,
    handleTermsClose,
    handlePrivacyClose,
    handleTermsAccept,
    handlePrivacyAccept,
}) => {
    return (
        <>
            <Dialog open={termsOpen} onClose={handleTermsClose} fullScreen>
                <AppBar sx={{ position: "relative", bgcolor: "#128C7E" }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleTermsClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography
                            sx={{ ml: 2, flex: 1 }}
                            variant="h6"
                            component="div"
                        >
                            Terms of Service
                        </Typography>
                        <Button
                            autoFocus
                            color="inherit"
                            onClick={handleTermsClose}
                            disabled={!termsAccepted}
                        >
                            Accept
                        </Button>
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    <Box sx={{ maxWidth: 800, mx: "auto", py: 4 }}>
                        <Typography variant="h4" gutterBottom>
                            Terms of Service
                        </Typography>

                        <Typography variant="body1" paragraph>
                            Last updated: {new Date().toLocaleDateString()}
                        </Typography>

                        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                            1. Acceptance of Terms
                        </Typography>
                        <Typography variant="body1" paragraph>
                            By accessing and using WhatsPlan, you accept and
                            agree to be bound by the terms and conditions of
                            this agreement.
                        </Typography>

                        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                            2. Description of Service
                        </Typography>
                        <Typography variant="body1" paragraph>
                            WhatsPlan is a scheduling automation service that
                            integrates with Google Calendar and Gmail to help
                            users manage their appointments and communications
                            more efficiently.
                        </Typography>

                        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                            3. Google API Services User Data Policy
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Our application adheres to the Google API Services
                            User Data Policy, including the Limited Use
                            requirements. We access, use, and transfer user data
                            only for the purposes that are permitted by our
                            users, and we provide a privacy policy and terms of
                            service that clearly describe how we use the data.
                        </Typography>

                        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                            4. User Obligations
                        </Typography>
                        <Typography variant="body1" paragraph>
                            You agree to: • Provide accurate information •
                            Maintain the security of your account • Not use the
                            service for any illegal purposes • Not interfere
                            with the service's operation
                        </Typography>

                        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                            5. Limitation of Liability
                        </Typography>
                        <Typography variant="body1" paragraph>
                            WhatsPlan is provided "as is" without any
                            warranties. We are not liable for any damages
                            arising from your use of the service.
                        </Typography>

                        <Box sx={{ mt: 4 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={termsAccepted}
                                        onChange={(e) =>
                                            handleTermsAccept(e.target.checked)
                                        }
                                        color="primary"
                                    />
                                }
                                label="I have read and agree to the Terms of Service"
                            />
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>

            <Dialog open={privacyOpen} onClose={handlePrivacyClose} fullScreen>
                <AppBar sx={{ position: "relative", bgcolor: "#128C7E" }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handlePrivacyClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography
                            sx={{ ml: 2, flex: 1 }}
                            variant="h6"
                            component="div"
                        >
                            Privacy Policy
                        </Typography>
                        <Button
                            autoFocus
                            color="inherit"
                            onClick={handlePrivacyClose}
                            disabled={!privacyAccepted}
                        >
                            Accept
                        </Button>
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    <Box sx={{ maxWidth: 800, mx: "auto", py: 4 }}>
                        <Typography variant="h4" gutterBottom>
                            Privacy Policy
                        </Typography>

                        <Typography variant="body1" paragraph>
                            Last updated: {new Date().toLocaleDateString()}
                        </Typography>

                        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                            1. Information We Collect
                        </Typography>
                        <Typography variant="body1" paragraph>
                            When you use WhatsPlan, we collect information that
                            you provide directly to us, including: • Google
                            Calendar data when you grant access • Email data
                            when you grant access to Gmail • Account information
                            necessary for the service
                        </Typography>

                        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                            2. How We Use Your Information
                        </Typography>
                        <Typography variant="body1" paragraph>
                            We use the information we collect to: • Provide,
                            maintain, and improve our services • Process and
                            complete your scheduling requests • Send you
                            technical notices and support messages • Respond to
                            your comments and questions
                        </Typography>

                        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                            3. Data Security
                        </Typography>
                        <Typography variant="body1" paragraph>
                            We implement appropriate security measures to
                            protect your personal information. However, no
                            method of transmission over the Internet is 100%
                            secure.
                        </Typography>

                        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                            4. Third-Party Services
                        </Typography>
                        <Typography variant="body1" paragraph>
                            We use Google Calendar and Gmail APIs. Your use of
                            these services is subject to their respective
                            privacy policies.
                        </Typography>

                        <Box sx={{ mt: 4 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={privacyAccepted}
                                        onChange={(e) =>
                                            handlePrivacyAccept(
                                                e.target.checked
                                            )
                                        }
                                        color="primary"
                                    />
                                }
                                label="I have read and agree to the Privacy Policy"
                            />
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default LegalConsentDialogs;

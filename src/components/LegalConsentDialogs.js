import React from "react";
import {
    Dialog,
    DialogContent,
    Button,
    FormControlLabel,
    Checkbox,
    Typography,
    Box,
    IconButton,
    AppBar,
    Toolbar,
    Divider,
    DialogTitle,
    DialogActions,
    Tab,
    Tabs,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsOfService from "../pages/TermsOfService";
import { useLanguage } from "../contexts/LanguageContext";

const LegalConsentDialogs = ({
    termsOpen,
    privacyOpen,
    combinedOpen,
    termsAccepted,
    privacyAccepted,
    handleTermsClose,
    handlePrivacyClose,
    handleCombinedClose,
    handleTermsAccept,
    handlePrivacyAccept,
}) => {
    const { translations } = useLanguage();
    const [activeTab, setActiveTab] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <>
            {/* Individual Dialogs */}
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
                            {translations.termsOfService}
                        </Typography>
                        <Button
                            autoFocus
                            color="inherit"
                            onClick={handleTermsClose}
                            disabled={!termsAccepted}
                        >
                            {translations.accept || "Accept"}
                        </Button>
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    <Box sx={{ maxWidth: 800, mx: "auto" }}>
                        <TermsOfService />

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
                                label={
                                    translations.iAgreeToTerms ||
                                    "I have read and agree to the Terms of Service"
                                }
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
                            {translations.privacyPolicy}
                        </Typography>
                        <Button
                            autoFocus
                            color="inherit"
                            onClick={handlePrivacyClose}
                            disabled={!privacyAccepted}
                        >
                            {translations.accept || "Accept"}
                        </Button>
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    <Box sx={{ maxWidth: 800, mx: "auto" }}>
                        <PrivacyPolicy />

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
                                label={
                                    translations.iAgreeToPrivacy ||
                                    "I have read and agree to the Privacy Policy"
                                }
                            />
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>

            {/* Combined Dialog */}
            <Dialog
                open={combinedOpen}
                onClose={handleCombinedClose}
                maxWidth="md"
                PaperProps={{
                    sx: {
                        width: "35%",
                        maxHeight: "90vh",
                        display: "flex",
                        flexDirection: "column",
                    },
                }}
            >
                <DialogTitle
                    sx={{ bgcolor: "#128C7E", color: "white", pb: 1, px: 3 }}
                >
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Typography variant="h6">
                            {translations.legalDocuments || "Legal Documents"}
                        </Typography>
                        <IconButton
                            edge="end"
                            color="inherit"
                            onClick={handleCombinedClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        sx={{
                            mt: 1,
                            minHeight: "40px",
                            "& .MuiTab-root": {
                                color: "rgba(255,255,255,0.7)",
                                minHeight: "40px",
                                "&.Mui-selected": {
                                    color: "white",
                                },
                            },
                            "& .MuiTabs-indicator": {
                                backgroundColor: "white",
                            },
                        }}
                    >
                        <Tab label={translations.termsOfService} />
                        <Tab label={translations.privacyPolicy} />
                    </Tabs>
                </DialogTitle>
                <DialogContent
                    sx={{
                        p: 3,
                        overflow: "auto",
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {activeTab === 0 ? (
                        <Box
                            sx={{
                                "& h3": { fontSize: "1.5rem" },
                                "& h5": { fontSize: "1.1rem", mt: 2 },
                                "& p": { fontSize: "0.9rem" },
                            }}
                        >
                            <TermsOfService />
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                "& h3": { fontSize: "1.5rem" },
                                "& h5": { fontSize: "1.1rem", mt: 2 },
                                "& p": { fontSize: "0.9rem" },
                            }}
                        >
                            <PrivacyPolicy />
                        </Box>
                    )}
                </DialogContent>
                <Divider />
                <DialogActions
                    sx={{
                        px: 3,
                        py: 2,
                        flexDirection: "column",
                        alignItems: "flex-start",
                    }}
                >
                    <Box
                        sx={{
                            width: "100%",
                            mb: 2,
                            display: "flex",
                            alignItems: "flex-start",
                        }}
                    >
                        <Checkbox
                            checked={termsAccepted}
                            onChange={(e) =>
                                handleTermsAccept(e.target.checked)
                            }
                            color="primary"
                            sx={{ padding: "0", mr: 1, mt: "2px" }}
                        />
                        <Typography
                            variant="body2"
                            component="label"
                            onClick={() => handleTermsAccept(!termsAccepted)}
                        >
                            {translations.iAgreeToTerms}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            width: "100%",
                            mb: 2,
                            display: "flex",
                            alignItems: "flex-start",
                        }}
                    >
                        <Checkbox
                            checked={privacyAccepted}
                            onChange={(e) =>
                                handlePrivacyAccept(e.target.checked)
                            }
                            color="primary"
                            sx={{ padding: "0", mr: 1, mt: "2px" }}
                        />
                        <Typography
                            variant="body2"
                            component="label"
                            onClick={() =>
                                handlePrivacyAccept(!privacyAccepted)
                            }
                        >
                            {translations.iAgreeToPrivacy}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "flex-end",
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCombinedClose}
                            disabled={!termsAccepted || !privacyAccepted}
                            sx={{
                                bgcolor: "#128C7E",
                                "&:hover": { bgcolor: "#0b7a6e" },
                            }}
                        >
                            {translations.accept}
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default LegalConsentDialogs;

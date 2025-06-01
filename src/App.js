import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Landing";
import LoginPage from "./pages/Login";
import UserPage from "./pages/User";
import "./index.css";
import { createTheme, ThemeProvider } from "@mui/material";
import { green } from "@mui/material/colors";
import SignUpPage from "./pages/SignUp";
import AuthSuccess from "./pages/AuthSuccess";
import AuthError from "./pages/AuthError";
import { LanguageProvider } from "./contexts/LanguageContext";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import { GoogleOAuthProvider } from "@react-oauth/google";

const theme = createTheme({
    palette: {
        primary: {
            main: green[500],
            secondary: "#ff0000",
        },
    },
});

function App() {
    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <LanguageProvider>
                <SnackbarProvider>
                    <ThemeProvider theme={theme}>
                        <Router>
                            <LanguageSwitcher />
                            <Routes>
                                <Route path="/" element={<LandingPage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route
                                    path="/signup"
                                    element={<SignUpPage />}
                                />
                                <Route
                                    path="/forgot-password"
                                    element={<ForgotPassword />}
                                />
                                <Route
                                    path="/reset-password"
                                    element={<ResetPassword />}
                                />
                                <Route
                                    path="/user/:userId"
                                    element={<UserPage />}
                                />
                                <Route
                                    path="/auth-success"
                                    element={<AuthSuccess />}
                                />
                                <Route
                                    path="/auth-error"
                                    element={<AuthError />}
                                />
                                <Route
                                    path="/privacy-policy"
                                    element={<PrivacyPolicy />}
                                />
                                <Route
                                    path="/terms-of-service"
                                    element={<TermsOfService />}
                                />
                            </Routes>
                        </Router>
                    </ThemeProvider>
                </SnackbarProvider>
            </LanguageProvider>
        </GoogleOAuthProvider>
    );
}

export default App;

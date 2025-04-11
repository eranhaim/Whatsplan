import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Landing";
import LoginPage from "./pages/Login";
import UserPage from "./pages/User";
import "./index.css";
import { createTheme, ThemeProvider } from "@mui/material";
import { green } from "@mui/material/colors";
import SignUpPage from "./pages/SignUp";
import ParticlesComponent from "./components/particles";
import AuthSuccess from "./pages/AuthSuccess";
import AuthError from "./pages/AuthError";
import { LanguageProvider } from "./contexts/LanguageContext";
import LanguageSwitcher from "./components/LanguageSwitcher";

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
        <LanguageProvider>
            <ParticlesComponent id="particles" style={{ zIndex: -1 }} />
            <ThemeProvider theme={theme}>
                <Router>
                    <LanguageSwitcher />
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignUpPage />} />
                        <Route path="/user/:phoneNum" element={<UserPage />} />
                        <Route path="/auth-success" element={<AuthSuccess />} />
                        <Route path="/auth-error" element={<AuthError />} />
                    </Routes>
                </Router>
            </ThemeProvider>
        </LanguageProvider>
    );
}

export default App;

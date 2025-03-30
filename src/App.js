import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
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
        <>
            <ParticlesComponent id="particles" style={{ zIndex: -1 }} />
            <ThemeProvider theme={theme}>
                <Router>
                    <Route path="/" exact>
                        <LandingPage />
                    </Route>
                    <Route path="/login" exact>
                        <LoginPage />
                    </Route>
                    <Route path="/signup" exact>
                        <SignUpPage />
                    </Route>
                    <Route path="/user">
                        <UserPage />
                    </Route>
                    <Route path="/auth-success" element={<AuthSuccess />} />
                    <Route path="/auth-error" element={<AuthError />} />
                </Router>
            </ThemeProvider>
        </>
    );
}

export default App;

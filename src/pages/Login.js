import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import GoogleAuthDialog from "../components/googleAuthDialog";
import { useNavigate } from "react-router-dom";
import config from "../config";
import { useLanguage } from "../contexts/LanguageContext";

export default function LoginPage() {
    const [showGoogleAuth, setShowGoogleAuth] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const { translations, language } = useLanguage();

    // const login = () => {
    //     fetch("http://localhost:100/login", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(user),
    //     })
    //         .then((res) => res.json())
    //         .then((res) => {
    //             if (res.success) window.location.href = `/user/${phoneNum}`;
    //             else alert("details didnt match");
    //         });
    // };

    const handleLogin = async (credentials) => {
        try {
            const response = await fetch(`${config.API_BASE_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();
            if (data.success) {
                setUser(data.user);
                if (data.needsGoogleAuth) {
                    setShowGoogleAuth(true);
                } else {
                    navigate(`/user/${data.user.phoneNum}`);
                }
            } else {
                alert(translations.auth.invalidCredentials);
            }
        } catch (error) {
            console.error("Login failed:", error);
            alert(translations.auth.loginFailed);
        }
    };

    // components/Login.jsx

    return (
        <>
            <GoogleAuthDialog
                open={showGoogleAuth}
                onClose={() => {
                    setShowGoogleAuth(false);
                    navigate(`/user/${user?.phoneNum}`);
                }}
                user={user}
            />
            <div style={{ display: "flex", justifyContent: "center" }}>
                <div
                    style={{
                        flex: 1,
                        maxWidth: "500px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 5,
                        direction: language === "he" ? "rtl" : "ltr",
                    }}
                >
                    <div className="landing">WhatsPlan</div>
                    <TextField
                        variant="filled"
                        label={translations.login.phoneNumber}
                        onChange={({ target }) =>
                            setUser({ ...user, phoneNum: target.value })
                        }
                        value={user?.phoneNum}
                    />
                    <TextField
                        variant="filled"
                        label={translations.login.password}
                        type="password"
                        onChange={({ target }) =>
                            setUser({ ...user, password: target.value })
                        }
                        value={user?.password}
                    />
                    <Button
                        variant="contained"
                        style={{ color: "#f3f3f3" }}
                        onClick={() => handleLogin(user)}
                    >
                        {translations.login.signIn}
                    </Button>
                </div>
            </div>
        </>
    );
}

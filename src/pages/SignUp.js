import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import config from "../config";

export default function SignUpPage() {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        phoneNum: "",
        govID: "",
        nationality: "",
    });
    const navigate = useNavigate();

    const handleSignUp = async () => {
        try {
            const response = await fetch(`${config.API_BASE_URL}/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });
            const data = await response.json();
            if (data.success) {
                navigate("/login");
            } else {
                alert(
                    data.alreadyExists
                        ? "User already exists"
                        : "Sign up failed"
                );
            }
        } catch (error) {
            console.error("Sign up failed:", error);
            alert("Sign up failed. Please try again.");
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <div
                style={{
                    flex: 1,
                    maxWidth: "500px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 5,
                }}
            >
                <div className="landing">WhatsPlan</div>
                <TextField
                    variant="filled"
                    label="Name"
                    onChange={({ target }) =>
                        setUser({ ...user, name: target.value })
                    }
                    value={user.name}
                />
                <TextField
                    variant="filled"
                    label="Email"
                    type="email"
                    onChange={({ target }) =>
                        setUser({ ...user, email: target.value })
                    }
                    value={user.email}
                />
                <TextField
                    variant="filled"
                    label="Password"
                    type="password"
                    onChange={({ target }) =>
                        setUser({ ...user, password: target.value })
                    }
                    value={user.password}
                />
                <TextField
                    variant="filled"
                    label="Phone Number"
                    onChange={({ target }) =>
                        setUser({ ...user, phoneNum: target.value })
                    }
                    value={user.phoneNum}
                />
                <TextField
                    variant="filled"
                    label="Government ID"
                    onChange={({ target }) =>
                        setUser({ ...user, govID: target.value })
                    }
                    value={user.govID}
                />
                <TextField
                    variant="filled"
                    label="Nationality"
                    onChange={({ target }) =>
                        setUser({ ...user, nationality: target.value })
                    }
                    value={user.nationality}
                />
                <Button
                    variant="contained"
                    style={{ color: "#f3f3f3" }}
                    onClick={handleSignUp}
                >
                    Sign up
                </Button>
            </div>
        </div>
    );
}

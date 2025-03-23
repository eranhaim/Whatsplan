import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';

export default function LoginPage(){
    const [phoneNum, setPhoneNum] = useState("");
    const [password, setPassword] = useState("");

    const login = () => {
        fetch("http://localhost:100/login", {
            method: "POST",
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phoneNum, password })
        })
        .then(res => res.json())
        .then(res => {
            if(res.success)
                window.location.href = `/user/${phoneNum}`;
            else alert("details didnt match")
        })
    }

    return (
        <>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ flex: 1, maxWidth: "500px", display: "flex", flexDirection: "column", gap: 5 }}>
                    <div className="landing">WhatsPlan</div>
                    <TextField variant="filled" label="Phone Number" onChange={({target}) => setPhoneNum(target.value)} value={phoneNum}/>
                    <TextField variant="filled" label="Password" onChange={({target}) => setPassword(target.value)} value={password}/>
                    <Button variant="contained" style={{ color: "#f3f3f3" }} onClick={() => login()}>Sign in</Button>
                </div>
            </div>
        </>
    );
}
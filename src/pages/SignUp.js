import { Button, TextField } from '@mui/material';
import React, { useState } from 'react';

export default function SignUpPage(){
    const [user, setUser] = useState({
        settingsFlags: "",
        settings: {},
        upcomingEvents: []
    });

    const fields = [
        {
            title: "Full Name",
            fieldName: "name",
            fieldType: "text"
        },
        {
            title: "Phone Number",
            fieldName: "phoneNum",
            fieldType: "number"
        },
        {
            title: "Email",
            fieldName: "email",
            fieldType: "email"
        },
        {
            title: "Government ID",
            fieldName: "govID",
            fieldType: "text"
        },
        {
            title: "Password",
            fieldName: "password",
            fieldType: "password"
        },
    ];

    const doSignUp = () => {
        fetch("http://localhost:100/signup", {
            method: "POST",
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(res => res.json())
        .then(res => {
            if(res.success)
                window.location.href = "/";
            else {
                //do a proper warning later
                window.alert("something went wrong, user already exists")
            }
        })
    }

    return <div style={{display: "flex", justifyContent: "center"}}>
            <div style={{ flex: 1, maxWidth: "500px", padding: 20, display: "flex", flexDirection: "column", gap: 10}}>
                <div className="landing" >WhatsPlan</div>
                {fields.map((field, index) => {
                    return (<TextField
                        variant='filled'
                        key={index}
                        label={field.title}
                        type={field.fieldType}
                        onChange={({target}) => setUser({...user, [field.fieldName]: target.value})}
                        />);
                })}
                <Button variant="contained" style={{color: "white"}} onClick={doSignUp}>SignUp</Button>
            </div>
        </div>
}
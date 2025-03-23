import { Button } from '@mui/material';
import React from 'react';

export default function LandingPage(){
    return <div style={{height: "100vh", display: "flex"}}>
        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", flex: 1}}>
            <div className="landing">WhatsPlan</div>
            <div>
                <Button style={{color: "white", marginRight: 5}} href="/login" color="primary" variant="contained" >Log In</Button>
                <Button style={{color: "white"}} href='/signup' color="primary" variant="contained">Sign Up</Button>
            </div>
        </div>
    </div>
}
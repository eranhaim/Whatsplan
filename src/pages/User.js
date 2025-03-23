import { Check } from '@mui/icons-material';
import { Button, Checkbox, LinearProgress, TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';
const UrlParams = window.location.href.split("/");

export default function UserPage(){
    const [user, setUser] = useState();
    const [qrCode, setQrCode] = useState(null);
    const [isInSession, setIsInSession] = useState(false);

    const botSettings = [
        {
            id: 1,
            text: "לקבל סיכום שבועי בראשון",
        },
        {
            id: 2,
            text: "לקבל עדכון יומי בבוקר כל יום",
        },
        {
            id: 3,
            text: "לקבוע אירועים ביומן Google Calandar",
        },
    ]

    useEffect(() => {
        (async () => {
                //fetch user details and settings
                // try{
                //     const fetchedUser = await fetch(`http://localhost:100/getUser/${UrlParams[UrlParams.length - 1]}`);
                //     setUser(fetchedUser);

                //     console.log(fetchedUser)

                //     const fetchedQR = await fetch(`http://localhost:100/startOrLoadSession/${fetchedUser._id}`);
                //     setQrCode(fetchedQR.qr);
                // } catch(err){
                //     console.log(err)
                // }

                fetch(`http://localhost:100/getUser/${UrlParams[UrlParams.length - 1]}`)
                .then(res => res.json())
                .then(res => {
                    setUser(res);
                    fetch(`http://localhost:100/startOrLoadSession/${res._id}`)
                    .then(res => res.json())
                    .then(res => {
                        if(!res.success)
                            alert("failed for some resone");
                        else{
                            if(res.qr) setQrCode(res.qr);
                            setIsInSession(true)
                        }
                    });
                })
            }
        )();
    }, []);

    const getSummery = () => {
        fetch("http://localhost:100/clientBotRequest", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            body: JSON.stringify({ userID: user._id, type: 1 })
        })
    }
    
    return <div style={{ height: "95vh", display: "flex", flexDirection: "column", alignItems: "center", padding: 10}}>
            <div style={{ flex: 1, backgroundColor: "#f3f3f3", borderRadius: 10, boxShadow: "black 0px 0px 7px 0px", padding: 10, display: "flex", flexDirection: "column", direction: "rtl", minWidth: 400}}>
                <div style={{textAlign: "center", fontWeight: "bold", fontSize: 30}}>{user?.name}</div>
                <div className="alreadySigned">
                    {isInSession? <div style={{ textAlign: "center"}}>
                        <Check style={{ marginTop: 20, fontSize: 60, border: "1px solid black", borderRadius: "50%", backgroundColor: "#00A884", }}/>
                    </div>:
                    <div><LinearProgress /></div>}
                    <img src={qrCode} alt={""} />
                </div>
                {/* {isInSession? <div>
                        <Check/>
                    </div>:
                    
                } */}
                <h3>הגדרות בוט</h3>
                <LinearProgress />
                <div>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <div>
                            <Button
                                style={{color: "#f3f3f3"}}
                                variant="contained"
                                onClick={getSummery}
                            >
                                לקבל עדכון שבועי עכשיו
                            </Button>
                        </div>
                        {botSettings.map(item => <div key={item.id}>
                            <Checkbox/>
                            {item.text}
                        </div>)}
                        <TextField multiline maxRows={6} placeholder="פניה חופשית לבוט"/>
                        <Button style={{marginTop: 10, color: "#f3f3f3"}} variant="contained">שלח פניה</Button>
                    </div>
                </div>
            </div>
        </div>
}
"use client";

import React from "react";
import {useAuth0} from "@auth0/auth0-react";
import {Button} from "@mui/material";

const LoginButton = ({ticketId}: { ticketId: string }) => {
    const {loginWithRedirect} = useAuth0();

    return <Button variant="contained"
                   sx={{backgroundColor: "#095e5d", m: "20px"}}
                   onClick={() => loginWithRedirect({appState: {ticketId}})}>Log In</Button>
};

export default LoginButton;

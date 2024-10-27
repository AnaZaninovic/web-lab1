"use client";

import {useAuth0} from "@auth0/auth0-react";
import LoginButton from "@/app/components/LoginButton";
import {Stack} from "@mui/material";

const Profile = ({ticketId}: { ticketId: string }) => {
    const {user, isAuthenticated, isLoading} = useAuth0();

    if (isLoading) {
        return <div>Loading ...</div>;
    }

    if (isAuthenticated && user)
        return (
            <Stack spacing={2} direction="row">
                <img style={{width: "64px"}} src={user.picture} alt={user.name}/>
                <Stack spacing={2}>
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>
                </Stack>
            </Stack>
        );

    return (
        <Stack alignItems="center">
            <h2>Please login to view details</h2>

            <LoginButton ticketId={ticketId}/>
        </Stack>
    );
};

export default Profile;

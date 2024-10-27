"use client";

import {getTicket} from "@/app/actions/getTicket";
import {useEffect, useState} from "react";
import {Ticket} from "@/models/ticket";
import Profile from "@/app/components/Profile";
import {useAuth0} from "@auth0/auth0-react";
import {Container, Grid2, Stack} from "@mui/material";
import {TicketIcon} from "@/icons/TicketIcon";
import {CheckmarkIcon} from "@/icons/CheckmarkIcon";
import {IconClose} from "@/icons/IconClose";

const TicketPage = ({params}: { params: Promise<{ ticketId: string }> }) => {
    const [ticketId, setTicketId] = useState<string>();
    const [ticket, setTicket] = useState<Ticket | null>();
    const [isLoadingTicket, setIsLoadingTicket] = useState<boolean>(true);
    const {isAuthenticated, isLoading, getAccessTokenSilently} = useAuth0();

    const loadTicketId = async () => {
        const {ticketId} = await params;
        setTicketId(ticketId);
    }

    useEffect(() => {
        void loadTicketId();
    }, []);

    const getTicketData = async () => {
        if (!isAuthenticated || isLoading || !ticketId) return;

        setIsLoadingTicket(true);

        const accessToken = await getAccessTokenSilently();

        const ticket = await getTicket(ticketId, accessToken);
        setTicket(ticket);
        setIsLoadingTicket(false);
    }

    useEffect(() => {
        void getTicketData();
    }, [ticketId, isAuthenticated, isLoading]);

    return (
        <Container maxWidth="lg">
            <Stack
                width="100%"
                height="100vh"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                spacing={5}>
                {isLoadingTicket || isLoading ?
                    isAuthenticated ? <h3>Loading...</h3> : null
                    :
                    (ticket ? (
                                <>
                                    <Stack direction="row" spacing={2}>
                                        <TicketIcon width={64} height={64} color="#095e5d"/>
                                        <CheckmarkIcon width={64} height={64} color="#095e5d"/>
                                    </Stack>

                                    <Grid2 container border="1px solid #aaa" spacing={2} p={5}>
                                        <Grid2 size={{xs: 4}}>
                                            <h3>OIB:</h3>
                                        </Grid2>
                                        <Grid2 size={{xs: 8}}>
                                            <h3>{ticket.vatin}</h3>
                                        </Grid2>

                                        <Grid2 size={{xs: 4}}>
                                            <h3>First name:</h3>
                                        </Grid2>
                                        <Grid2 size={{xs: 8}}>
                                            <h3>{ticket.firstname}</h3>
                                        </Grid2>

                                        <Grid2 size={{xs: 4}}>
                                            <h3>Last name:</h3>
                                        </Grid2>
                                        <Grid2 size={{xs: 8}}>
                                            <h3>{ticket.lastname}</h3>
                                        </Grid2>

                                        <Grid2 size={{xs: 4}}>
                                            <h3>Created at:</h3>
                                        </Grid2>
                                        <Grid2 size={{xs: 8}}>
                                            <h3>{ticket.createdat.toDateString()} {ticket.createdat.toTimeString()}</h3>
                                        </Grid2>
                                    </Grid2>
                                </>
                            ) :
                            <Stack direction="row" spacing={2}>
                                <TicketIcon width={64} height={64} color="#7a1d38"/>
                                <IconClose width={64} height={64} color="#7a1d38"/>
                            </Stack>
                    )
                }

                <Stack>
                    {ticketId && <Profile ticketId={ticketId}/>}
                </Stack>
            </Stack>
        </Container>
    )
}

export default TicketPage;

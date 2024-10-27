'use server';

import {TicketRepository} from "@/repositories/TicketRepository";

async function verifyOpaqueToken(token: string) {
    const introspectionUrl = 'https://dev-dql1ocd66ubqcx1g.us.auth0.com/userinfo';

    try {
        const response = await fetch(introspectionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + token
            },
            body: new URLSearchParams({ token })
        });

        const data = await response.json();

        console.table(data);

        return data;
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
}


export const getTicket = async (ticketId: string, accessToken: string) => {
    const userData = await verifyOpaqueToken(accessToken);

    if (!userData) {
        throw new Error('Invalid token');
    }

    const ticketRepo = new TicketRepository();

    await ticketRepo.init();

    const ticket = await ticketRepo.getById(ticketId);

    console.table(ticket);

    return ticket;
}

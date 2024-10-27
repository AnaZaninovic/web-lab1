'use server';

import {TicketRepository} from "@/repositories/TicketRepository";

export const getTicketsCount = async () => {
    const ticketRepo = new TicketRepository();

    await ticketRepo.init();

    return await ticketRepo.getAllCount();
}

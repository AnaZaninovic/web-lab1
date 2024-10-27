import {getDbConnection} from "@/repositories/db";
import {Ticket} from "@/models/ticket";

export class TicketRepository {
    private sql = getDbConnection();

    public createTicket = async (vatin: string, firstName: string, lastName: string) => {
        const ticket = await this.sql<Ticket[]>`INSERT INTO tickets (vatin, firstName, lastName) VALUES (${vatin}, ${firstName}, ${lastName}) RETURNING *`;

        return ticket[0] as Ticket;
    }

    public getById = async (id: string) => {
        const ticket = await this.sql<Ticket[]>`SELECT * FROM tickets WHERE id = ${id}`;

        return ticket[0] as Ticket | undefined;
    }

    public getAllByOib = async (vatin: string) => {
        const tickets = await this.sql<Ticket[]>`SELECT * FROM tickets WHERE vatin = ${vatin}`;

        return tickets;
    }

    public getAllCount = async () => {
        const count = await this.sql`SELECT COUNT(*) FROM tickets`;

        return count[0].count;
    }

    public init = async () => {
        const tableExists = await this.sql`
            SELECT EXISTS (
                SELECT 1
                FROM information_schema.tables
                WHERE table_name = 'tickets'
            )
        `;

        if(tableExists[0].exists) {
            return;
        }

        await this.sql`
            CREATE TABLE IF NOT EXISTS tickets (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                
                vatin TEXT NOT NULL,
                firstName TEXT NOT NULL,
                lastName TEXT NOT NULL,
                
                createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            )
        `;

        console.log('Table tickets created');
    }
}

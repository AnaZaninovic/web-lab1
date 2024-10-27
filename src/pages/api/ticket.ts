import type {NextApiRequest, NextApiResponse} from 'next'
import {TicketRepository} from "@/repositories/TicketRepository";
import QRCode from 'qrcode';
import {GetPublicKeyOrSecret, SigningKeyCallback, verify} from "jsonwebtoken";
import {JsonWebKey} from "crypto";
import { ORIGIN } from '@/utils/config';

type RequestData = {
    vatin?: string;
    firstName?: string;
    lastName?: string;
}

const AUTH0_DOMAIN = 'https://web-lab1-ce9c.onrender.com';
const AUDIENCE = 'https://web-lab1-ce9c.onrender.com/api';
const ISSUER = `https://dev-dql1ocd66ubqcx1g.us.auth0.com/`;
const ALGORITHMS = ['RS256' as const];
const getKey: GetPublicKeyOrSecret = async (header, callback: SigningKeyCallback) => {
    const res = await fetch(`${AUTH0_DOMAIN}/.well-known/jwks.json`);
    const data = await res.json() as { keys: JsonWebKey[] };

    const key = data.keys.find((key) => key.kid === header.kid);

    if (!key) {
        return callback(new Error('Key not found'));
    }

    callback(null, {key, format: "jwk"});
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method != "POST") {
        res.status(405).json({message: 'Method Not Allowed'})
        return;
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({message: 'Unauthorized'})
        return;
    }

    try {
        verify(token, getKey, {
                algorithms: ALGORITHMS,
                audience: AUDIENCE,
                issuer: ISSUER
            },
            (err, decoded) => {
                if (err) {
                    throw err;
                }
                if (!decoded) {
                    throw new Error('No token');
                }
                if (typeof decoded === 'string') {
                    throw new Error('Invalid token');
                }
            }
        );
    } catch (e) {
        console.error(e);

        res.status(401).json({message: 'Unauthorized'})
        return;
    }

    const data = req.body as RequestData;

    if (!data.vatin || !data.firstName || !data.lastName) {
        res.status(400).json({message: 'Bad Request'})
        return;
    }

    const repo = new TicketRepository();
    const ticketsWithOib = await repo.getAllByOib(data.vatin);
    if (ticketsWithOib.length >= 3) {
        res.status(400).json({message: 'Too many tickets for this OIB'})
        return;
    }

    const ticket = await repo.createTicket(data.vatin, data.firstName, data.lastName);

    const qrFile = await QRCode.toBuffer(`${ORIGIN}/ticket/${ticket.id}`);

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename=${ticket.id}.png`);
    res.send(qrFile);
}

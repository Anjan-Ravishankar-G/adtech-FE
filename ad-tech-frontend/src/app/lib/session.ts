import "server-only";
import {SignJWT, jwtVerify} from "jose";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

type SessionPayload = {
    userId : string;
    expiresAt: Date;
}
export const API_URL = process.env.BACKEND_URL;

export const SESSION_SECRET = process.env.SESSION_SECRET_KEY!;

export const ENCODED_KEY = new TextEncoder().encode(SESSION_SECRET)
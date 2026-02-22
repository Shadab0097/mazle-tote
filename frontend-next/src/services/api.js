import axios from 'axios';

// In production, API calls go through Next.js rewrites (same origin).
// In development, fallback to localhost:5000.
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;

import axios from 'axios';

const api = axios.create({
    baseURL: '',
    withCredentials: true, // For cookie-based auth
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;

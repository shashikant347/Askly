// api.js
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;
export default API_URL;

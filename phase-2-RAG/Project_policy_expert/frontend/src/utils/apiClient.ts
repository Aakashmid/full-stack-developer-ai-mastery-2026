
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, 
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
//   withCredentials: true, // always send cookies
});



export default apiClient;
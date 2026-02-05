import axios from "axios";
import { Promise } from "mongoose";

const APP_URL = import.meta.env.VITE_API_URL || 'http://localhost:5173/'

export const api = axios.create({
    baseURL : APP_URL,
    headers : {
        'Content-Type' : 'application/json',
    },
    timeout : 10000,
});



// Request Interceptor - Add auth token.
api.interceptors.request.use((config) => {
    // get token from interceptors.
    const token = localStorage.getItem('token');
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
},
    (error) => {
        return Promise.reject(error);
    }
);


// Response interceptor-handle errors globally.
api.interceptors.response.use((res) => res, 
    (error) => {
        if(error.message){
            // server response with error.
            const {status, data} = error.message;

            switch(status){
                case 401:
                    // Unauthorized - clear token and redirect to login
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                    break;

                case 403:
                    // Forbidden - Access denied.
                    console.log('Access denied', data.message);
                    break;
                
                case 404:
                    // Resource not found.
                    console.log('Resource not found', data.message);
                    break;
                
                case 500:
                    // server error.
                    console.log('Server error', data.message);
                    break;

                default:
                    console.log('API Error', data.message);
            }
        }else if(error.request){
            // Request made but no response.
            console.error('Error', error.message);
        }

        return Promise.reject(error);
    }
)

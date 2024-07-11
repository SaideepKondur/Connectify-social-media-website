import axios from 'axios';
import { getItem, setItem, removeItem, KEY_ACCESS_TOKEN } from './localStorageManager';
import store from '../redux/store';
import { TOAST_FAILURE } from '../App';
import { setLoading, showToast } from '../redux/slices/appConfigSlice';

export const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_SERVER_BASE_URL,
    withCredentials: true
}) 



axiosClient.interceptors.request.use(
    (request) => {
        const accessToken = getItem(KEY_ACCESS_TOKEN);
        request.headers['Authorization'] = `Bearer ${accessToken}`;  
        store.dispatch(setLoading(true));
        return request;
    }
);

axiosClient.interceptors.response.use(

    async (response) => {
        store.dispatch(setLoading(false));
        // Extract data from the response
        const data = response.data;

        // If the response status is 'ok', return the data
        if(data.status === 'ok') {
            return data;
        }

        // Get the original request configuration and status code/error from the response
        const originalRequest = response.config;
        const statusCode = data.statusCode;

        const error = data.message;

        store.dispatch(showToast({
            type: TOAST_FAILURE,
            message: error
        }))


        //(When the access token expires) If the status code is 401 (unauthorized) and the request hasn't been retried yet
        if(statusCode===401 && !originalRequest._retry) { 
            // Mark the request as retried to avoid infinite loops
            originalRequest._retry = true;
            
            // Request a new access token using the refresh token
            const response = await axios.create({
                withCredentials: true,
            }).get(`${process.env.REACT_APP_SERVER_BASE_URL}/auth/refresh`);

            // If the refresh token request is successful
            if(response.data.status === 'ok') {

                // Store the new access token
                setItem(KEY_ACCESS_TOKEN, response.data.result.accessToken);
                 // Update the original request's authorization header with the new access token
                originalRequest.headers['Authorization'] = `Bearer ${response.data.result.accessToken}`;

                // Retry the original request with the new access token
                return axios(originalRequest)
            }
            else { //If the refresh token is also expired, remove the access token and redirect to login
                removeItem(KEY_ACCESS_TOKEN); 
                window.location.replace('/login', '_self');
                return Promise.reject(error); 
            }
        }
    

        //For other errors, reject the promise with the error message
        return Promise.reject(error);

    }, async(error) => {
        store.dispatch(setLoading(false));
        store.dispatch(showToast({
            type: TOAST_FAILURE,
            message: error.message
        }))
        return Promise.reject(error);
    }
);
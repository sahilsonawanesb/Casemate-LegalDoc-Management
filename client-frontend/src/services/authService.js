import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth/';

// implementing the functional based approach as follows.

// register user function
export const register = async(userData) => {

    try{
        const response = await axios.post(
            `${API_URL}signup`, 
            userData,
            {
                headers : {
                    "Content-Type" : "application/json"
                }
            }
        
        );

        if(response.data){
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('token',response.data.token);

        }

        return {
            success : true,
            user : response.data.user,
            token : response.data.token,
            message : response.data.message,
        }

    }catch(error){
            return {
                success : false,
                message : error.response?.data?.message || 'SignUp failed'
            }
    }
}

// Login user function 

export const login = async(userData) => {
    try{
        const response = await axios.post(
            `${API_URL}signin`, 
            userData,
            {
                headers : {
                    "Content-Type": "application/json"
                }
            }
        );
        if(response.data){
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('token', response.data.token);
        }

        return {
            success : true,
            user : response.data.user,
            token : response.data.token,
            message : response.data.message
            }
    }catch(error){
        return {
            success : false,
            message : error.response.data.message || 'Login failsed'
        }
    }
}

export const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
}

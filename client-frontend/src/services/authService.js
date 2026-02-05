import {api} from "./api.js";

// implementing the functional based approach as follows.

// register user function
export const register = async(userData) => {

    try{
        const response = await api.post('/auth/signup', userData);

        const {token, user, message} = response.data;

        if(token && user){
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token',response.data.token);

        }

        return {
            success : true,
            user,
            token,
            message
        }

    }catch(error){
            return {
                success : false,
                message : error.response?.data?.message || 'SignUp failed'
            }
    }
}

export const login = async(userData) => {
    try{
        const response = await api.post('/auth/signin', userData);

        const {token, user, message} = response.data;
          
        if(token && user){
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', response.data.token);
        }

        return {
            success : true,
            user,
            token,
            message
            }
    }catch(error){
        return {
            success : false,
            message : error.response.data.message || 'Login failsed'
        }
    }
}

// signOut function..
export const signOut = async() => {
    try{
        api.post('/user/logout').catch(err => {
            console.log('Logout API error', err.message);
        });

        // clear storage immediately..
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        return {
            success : true,
            message : 'Logout successfull'
        }
    }catch(error){
        console.log('Logout error', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        return {
            success : true,
            message : 'Logged out successfully'
        }

    }
}

// getProfile function..
export const getProfile = async() => {
    try{

        const response = await api.get('/user/profile');
        const {message, user} = response.data;
        if(user){
            localStorage.setItem('user', JSON.stringify(user));
        }
        
        return {
            success : true,
            user,
            message
        }

    }catch(error){
        return {
            success : false,
            message : error.response.data.message || 'Get Profile Details Fail'
        }
    }
}

// update user profile..
export const updateProfile = async(userData) => {
    try{

        const response = await api.put('/user/update-profile', userData);

        const {user, message} = response.data;

        if(user){
            localStorage.setItem('user', JSON.stringify(user));
        }

        return {
            success : true,
            message,
        }

    }catch(error){
        return {
            success : false,
            message : error.response.data.message || 'Failed to update the user profile'
        }
    }
}

// change password -- API not there.
export const changePassword = async(passwordData) => {
    try{

       const response = await api.post('/user/change-password', passwordData);
       
       return response;

    }catch(error){
        return {
            success : false,
            message : error.response.data.message || 'Failed to change the password'
        }
    }
}

// check if userIsAuthenticated.
export const isAuthenticated = async() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    return !!(token && user);
}

// get current user from localstorage.
export const currentUser = async() => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}
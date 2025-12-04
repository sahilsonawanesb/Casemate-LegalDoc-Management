import { createContext, useState } from "react";
import * as authService from "../services/authService.js";


// create Auth context.
const AuthContext = createContext();

// custom hook to use Auth Context.


// Auth Provider as follows:-
export const AuthProvider = ({children}) => {
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // login.
    const login = async(userData) => {
        setIsLoading(true);
        
            const res = await authService.login(userData);
            if(res.success){
                setUser(res.user);
                setIsLoading(false);
            }
        return res;
    }

    // register.
    const register = async(userData) => {
        setIsLoading(true);

        const res = await authService.register(userData);
        if(res.success){
            setUser(res.user);
            setIsLoading(false);
        }
        return res;
    }

    // logout.
    const logout = () => {
        authService.logout();
        setUser(null);
    }

    // value.
    const value = {
        user,
        login,
        register,
        logout,
        isLoading,
        // isAuthenticated : !!user
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )

};

export default AuthContext;



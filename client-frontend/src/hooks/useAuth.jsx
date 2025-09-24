import { useContext } from "react";
import AuthContext from "../context/AuthContext.jsx";

export const useAuth = () => {

    const context = useContext(AuthContext);

    if(!context){
        throw new Error('use auth must used within authprovider');
    }

    return context;
}
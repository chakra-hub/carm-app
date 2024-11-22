import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isEmailVerified, setIsEmailVerified] = useState(false);

    useEffect(()=>{
        const unsubscribe = auth.onAuthStateChanged((currentUser)=>{
            setUser(currentUser);
            setIsEmailVerified(currentUser?.emailVerified || false);
        })

        return () => unsubscribe();
    },[]);

    return(
        <AuthContext.Provider value={{user, isEmailVerified, setUser, setIsEmailVerified}}>
            {children}
        </AuthContext.Provider>
    )
} 

export const useAuth = () => { return useContext(AuthContext)}

import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { auth } from "./firebase";
import { User } from "firebase/auth";


interface AuthContextType {
  user?: User | null |undefined ;
  isEmailVerified?: boolean;
  setUser?:Dispatch<SetStateAction<User | null | undefined>>;
  setIsEmailVerified?:Dispatch<SetStateAction<boolean>>;

}
const AuthContext = createContext<AuthContextType>({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<null | User>();
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setIsEmailVerified(currentUser?.emailVerified || false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isEmailVerified, setUser, setIsEmailVerified }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

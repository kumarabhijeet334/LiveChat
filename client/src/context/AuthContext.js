import {createContext, useCallback, useEffect, useState} from "react";
import { postRequest } from "../utils/services";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [registerError, setRegisterError] = useState(null);
    const [isRegisterLoading, setIsRegisterLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });
 
    const [loginError, setLoginError] = useState(null);
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [loginData, setLoginData] = useState({
      email: "",
      password: ""
    }); 

    useEffect(()=>{
      const user = localStorage.getItem("User");
      setUser(JSON.parse(user));
    }, []);


    const updateFormData = useCallback((info) => {
        setFormData(info); 
    }, []);

    const updateLoginData = useCallback((info) => {
      setLoginData(info); 
    }, []);

    const registerUser = useCallback(async()=> {
      setIsRegisterLoading(true);
      setRegisterError(null);
      const response = await postRequest("/api/users/register", JSON.stringify(formData));
      setIsRegisterLoading(false);
      if(response.error){
        return setRegisterError(response);
      }
      
      localStorage.setItem("User", JSON.stringify(response));
      setUser(response);
    }, [formData]);

    const loginUser = useCallback(async()=> {
      setIsLoginLoading(true);
      setLoginError(null);
      const response = await postRequest("/api/users/login", JSON.stringify(loginData));
      setIsLoginLoading(false);
      if(response.error){
        return setLoginError(response);
      }
      
      localStorage.setItem("User", JSON.stringify(response));
      setUser(response);
    },[loginData]);
    
    const logoutUser = useCallback(()=> {
      localStorage.removeItem("User");
      setUser(null);
    },[])

    return (
        <AuthContext.Provider
          value={{
            user,
            formData,
            updateFormData,
            registerUser,
            registerError,
            isRegisterLoading,
            logoutUser,
            loginUser,
            loginData,
            loginError,
            updateLoginData,
            isLoginLoading
          }}
        >
          {children}
        </AuthContext.Provider>
    );
};



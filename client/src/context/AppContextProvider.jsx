import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import AppContext from "./appContext";


export function AppContextProvider(props){
    const [state,setState]=useState("Sign Up")
    const [isAuth,setIsAuth]=useState(false)
    const [userData,setUserData]=useState({})
    const backendUrl=import.meta.env.VITE_BACKED_URL
    axios.defaults.withCredentials=true
    const handleIsAuth=async()=>{
        try {
            const {data}=await axios.post(backendUrl+"/api/auth/is-auth")
            if(data.success){
                setIsAuth(true)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    const handleGetUserData=async()=>{
        try {
            const {data}=await axios.get(backendUrl+"/api/user/data")
            if(data.success){
                setUserData(data.userData)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    const value={
        backendUrl,
        state,setState,
        isAuth,setIsAuth,
        userData,setUserData,
        handleGetUserData,handleIsAuth,
    }

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}



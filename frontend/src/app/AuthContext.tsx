"use client"
import { createContext, ReactNode, useState,useEffect } from "react";
import type { User } from "./components/Chats";
type AuthContextType={
    user:User | null,
    token:string,
    setUser:(user:User | null)=>void
    setToken:(token:string)=>void
}
export const AuthContext=createContext<AuthContextType>({
    user:null,
    token:'',
    setUser:()=>{},
    setToken:()=>{}
})

type ContextProps={
    children:ReactNode
}
const AuthProvider=({children}:ContextProps)=>{
 
const [user,setUser]=useState<User | null>(null);
const [token,setToken]=useState<string>('')
useEffect(()=>{
    const storedUserInfo= JSON.parse(window.localStorage.getItem('userInfo') || '{}')
    setUser(storedUserInfo.data)
    setToken(storedUserInfo.data?.token || '')
},[])
return(
        <AuthContext.Provider value={{user,setUser, token, setToken}}>
            {children}
            </AuthContext.Provider>  
)
}
export default AuthProvider;
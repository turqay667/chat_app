"use client"
import { createContext, ReactNode } from "react";
type ApiContextType={
  apiUrl:string,

}
export const ApiContext=createContext<ApiContextType>({
apiUrl:'',
})
const apiUrl=process.env.NODE_ENV==='production' ? 'https://chat-app-64fc.onrender.com/api' : 'http://localhost:5000/api'
type ApiProviderProps={
  children:ReactNode
}
const ApiProvider=({children}:ApiProviderProps)=>{
    return (
        <ApiContext value={{apiUrl}}>
          {children}
        </ApiContext>
    )
}
export default ApiProvider;
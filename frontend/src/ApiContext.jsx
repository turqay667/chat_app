import { createContext } from "react";
export const ApiContext=createContext(null)
const apiUrl=process.env.NODE_ENV==='production' ? 'https://chat-app-64fc.onrender.com/api' : 'http://localhost:5000/api'
const userInfo = JSON.parse(localStorage.getItem('userInfo'))
const token=userInfo?.data?.token
const ApiProvider=(props)=>{
    return (
        <ApiContext.Provider value={{apiUrl, userInfo, token}}>
          {props.children}
        </ApiContext.Provider>
    )
}
export default ApiProvider;
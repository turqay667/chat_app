import { createContext, useEffect, useState } from "react";
export const ApiContext=createContext(null)
const apiUrl=process.env.NODE_ENV==='production' ? 'https://backend-aged-leaf-8417.fly.dev/api' : 'http://localhost:5000/api'



const ApiProvider=(props)=>{
const [userInfo,setUserInfo] = useState(null)
const [token, setToken]=useState(null)

  useEffect(()=>{
    const storedUserInfo=JSON.parse(localStorage.getItem('userInfo')) || {}
  setUserInfo(storedUserInfo)
  setToken(userInfo?.data?.token || '')
  },[])
    return (
        <ApiContext.Provider value={{apiUrl, userInfo, token}}>
          {props.children}
        </ApiContext.Provider>
    )
}
export default ApiProvider;
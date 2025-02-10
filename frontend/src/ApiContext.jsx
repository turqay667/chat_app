import { createContext } from "react";

export const ApiContext=createContext(null)
const apiUrl=process.env.NODE_ENV==='production' ? 'https://backend-aged-leaf-8417.fly.dev/api' : 'http://localhost:5000/api'
const ApiProvider=(props)=>{
    return (
        <ApiContext.Provider value={{apiUrl}}>
          {props.children}
        </ApiContext.Provider>
    )
}
export default ApiProvider;
import { createContext, useState } from "react";
export const AuthContext=createContext(null)

const AuthProvider=(props)=>{
const [user,setUser]=useState(null);


return(

        <AuthContext.Provider value={{user,setUser}}>
            {props.children}
            </AuthContext.Provider>
    
)
}
export default AuthProvider;
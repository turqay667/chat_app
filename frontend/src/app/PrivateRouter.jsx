import { Navigate } from "react-router-dom"
import { useContext } from "react"
import { ApiContext } from "./ApiContext"
const PrivateRouter=(props)=>{
const {userInfo}=useContext(ApiContext)
    if(userInfo){
    return (
        <div>{props.children}</div>
    )
}
else{
    return <Navigate to={'/login'}/>
}
}
export default PrivateRouter;
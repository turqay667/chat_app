import { Navigate } from "react-router-dom"

const PrivateRouter=(props)=>{
    const userInfo=localStorage.getItem('userInfo')
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
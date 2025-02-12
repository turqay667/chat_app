import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { BiUser } from "react-icons/bi";
import { CiLock } from "react-icons/ci";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {toast, ToastContainer } from "react-toastify";
import io from "socket.io-client"
import { IoEllipseSharp } from "react-icons/io5";
import { AuthContext } from "./AuthContext";
import { socket } from "./Socket";
import { ApiContext } from "./ApiContext";


const Login=()=>{
    const navigate=useNavigate()
    const [username,setUsername]=useState('')
    const [password,setPassword]=useState('')
    const [logged,setLogged]=useState(false)
    const [hide,setHide]=useState(false)
    const {setUser}=useContext(AuthContext)
    const {apiUrl}=useContext(ApiContext)
    
useEffect(()=>{
   if(logged){
 navigate("/home")} 
},[logged,navigate])

    const handleSubmit=async (e)=>{
        e.preventDefault();

        try{
const  config={
            headers:{"Content-Type":"application/json"},
        }
  const data = await axios.post(`${apiUrl}/login`,{username,password},config)
  localStorage.setItem('userInfo', JSON.stringify(data))
  socket.connect()
  setUser(username)  
  toast.success('Login successful')
  setLogged(true)
}
    catch(err){
      console.log(err)
      toast.error(err.response?.data?.message || 'Something went wrong')
}
    }
    return (
        <>
        <ToastContainer/>
        <div className="auth">
        <div className="container chat-login">
            <div className="login-card">
<div className="justify-content-center row">
    <div className="col-md-4">
    <form onSubmit={handleSubmit}>
    <div className="card authentication">
    <div className="title text-center">
            <h2 className="text-center ">Sign in</h2>
            <p className="">Sign in to continue to Chatpro</p>
            </div>
            <label >Username</label>
<div className="mb-3 position-relative">
<i className="btn  position-absolute "><BiUser fontSize={18}/></i>
<input type="text" placeholder="Enter Username" className="rounded-lg w-full focus:bg-none" name="username"  onChange={(e)=>setUsername(e.target.value)}/>
</div>
<div>
<div className="pass-input d-flex justify-content-between pt-2">
<label className="bs-gray-400">Password</label>
{/* <a className="forget-password ">Forgot password?</a> */}
</div>
<div className="position-relative">
<i className="btn position-absolute  "><CiLock fontSize={20}/></i>
<input type={hide ? "password" : "text"} placeholder="Enter Password" className="px-3 py-1.5 rounded-lg w-full" name="password" onChange={(e)=>setPassword(e.target.value)}/>
{
    hide ? <i className="btn hide " onClick={(e)=>setHide(false)}><FaEyeSlash/></i> : <i className="btn hide " onClick={(e)=>setHide(true)}><FaEye/></i>
}
</div>
</div>
<div className="submit-btn mt-4">
<button type="submit" className="btn text-white">Login</button>
</div>
</div>
</form>
</div>
</div>       
</div>
<p className="text-center text-white mt-3">Don't have an account? <Link className="" to={`/`}>Register</Link></p>
</div>
</div>
</>

    )
}

export default Login;
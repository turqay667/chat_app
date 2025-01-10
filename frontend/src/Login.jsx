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


const Login=()=>{
    const navigate=useNavigate()
    const [username,setUsername]=useState('')
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [logged,setLogged]=useState(false)
    const [hide,setHide]=useState(false)
    const [errors, setErrors]=useState(false)
    const {setUser}=useContext(AuthContext)
 
const userInfo=localStorage.getItem('userInfo')
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

  const data =await axios.post('https://chat-app-64fc.onrender.com/api/login',{username,password},config)
  localStorage.setItem('userInfo', JSON.stringify(data))
  setLogged(true)
  socket.connect()
  const loggedUser={username:username}
  setUser(loggedUser)  

  }
   
    catch(err){
        console.log(err)
        toast.error(err.name)
        setLogged(false)
    }
    }
    return (
        <>
        <ToastContainer/>
        <div className="auth">
        <div className="container chat-login">
            <div className="login-card">
<div className="justify-content-center row mt-4">
    <div className="col-md-4">
    <form onSubmit={handleSubmit}>
    <div className="card authentication">
    <div className="title text-center">
            <h2 className="text-center ">Sign in</h2>
            <p className="text-muted">Sign in to continue to Chatpro</p>
            </div>
            <label >Username</label>
<div className="mb-3 position-relative">
<i className="btn btn-light position-absolute text-muted"><BiUser fontSize={18}/></i>
<input type="text" placeholder="Enter Username" className="form-control" name="username" required onChange={(e)=>setUsername(e.target.value)}/>
</div>
<div>
<div className="pass-input d-flex justify-content-between">
<label>Password</label>
<a className="forget-password text-muted">Forgot password?</a>
</div>
<div className="position-relative">
<a className="btn btn-light position-absolute  text-muted"><CiLock fontSize={20}/></a>
<input type={hide ? "password" : "text"} placeholder="Enter Password" className="form-control" name="password" required onChange={(e)=>setPassword(e.target.value)}/>
{
    hide ? <a className="btn hide text-muted" onClick={(e)=>setHide(false)}><FaEyeSlash/></a> : <a className="btn hide text-muted" onClick={(e)=>setHide(true)}><FaEye/></a>
}
</div>
</div>
<div className="submit-btn mt-4">
<button type="submit" className="btn btn-primary">Login</button>
</div>
</div>
</form>
</div>
</div>       
</div>
<p className="text-center text-white mt-3">Don't have an account? <Link className="text-info" to={`/`}>Register</Link></p>
</div>
</div>
</>

    )
}

export default Login;
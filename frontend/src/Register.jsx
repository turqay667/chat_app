import axios from "axios"
import { useEffect, useState } from "react";
import {Link} from "react-router-dom"
import Login from "./Login";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { BiUser } from "react-icons/bi";
import { BiEnvelope } from "react-icons/bi";
import { CiLock } from "react-icons/ci";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate} from "react-router-dom";
import io from "socket.io-client"
// const socket=io.connect("http://localhost:5000/")
const Register=(props)=>{
  
    const navigate=useNavigate()
    const [username,setUsername]=useState('')
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [success,setSuccess]=useState(false)
    const[hide,setHide]=useState(false)

// if(success){
//     navigate("/login")
// }
    const handleSubmit=async (e)=>{
        e.preventDefault();
       try{
       const response =await axios.post('http://localhost:5000/api/auth/',{username,email,password},
        {
            headers:{ "Content-Type":"application/json" },
            withCredentials:true
        })
        localStorage.setItem("userInfo", JSON.stringify(response.data))
        toast.success("Successfully registered")
        setSuccess(true)   
       }
    
        catch(err){
            console.log(err)
            // toast.error(err)
        }
        
    }
useEffect(()=>{
    if(success){
        navigate('/login')
    }
},[success,navigate])

    return (
        <>
        <ToastContainer/>
        <div className="auth">
        <div className="container chat-login">
<div className="row justify-content-center mt-4">
    <div className="col-md-4">
    <form onSubmit={handleSubmit}>
    <div className="card authentication">
    <h3 className="text-center text-muted">Create Account</h3>
    <label >Username</label>
<div className=" mb-3 position-relative username-input">
<i className="btn btn-light position-absolute  text-muted"><BiUser fontSize={18}/></i>
<input type="text" placeholder="Enter Username" className="form-control" name="username"  onChange={(e)=>setUsername(e.target.value)}  required maxLength={15}/>
</div>

<label >Email</label>
<div className="mb-3 email-input position-relative">
<i className="btn btn-light position-absolute text-muted"><BiEnvelope fontSize={18}/></i>
<input type="email" placeholder="Enter Email" className="form-control" name="email" onChange={(e)=>setEmail(e.target.value)}  required  />

</div>
<div>
<div className="pass-input d-flex justify-content-between">
<label>Password</label>
<a className="forget-password text-muted">Forgot password?</a>
</div>
<div className="position-relative">
<i className="btn btn-light position-absolute  text-muted"><CiLock fontSize={20}/></i>
<input type={hide ? "password" : "text"} placeholder="Enter Password" className="form-control" onChange={(e)=>setPassword(e.target.value)} required minLength={8}/>
{
    hide ? <i className="btn hide text-muted" onClick={(e)=>setHide(false)}><FaEyeSlash/></i> : <i className="btn hide text-muted" onClick={(e)=>setHide(true)}><FaEye/></i>
}

</div>
</div>
<div className="submit-btn mt-4">
<button type="submit" className="btn btn-primary">Register</button>

</div>
</div>
</form>
</div>
<p className="text-center text-white mt-3">Already have an account? <Link className="text-info" to={`/login`}>Login</Link></p>       
</div>
</div>
</div>
</>
    )
}
export default Register;
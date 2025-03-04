"use client"
import { useState,useContext, useEffect } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ApiContext } from "./ApiContext";
import axios from "axios";
import  ToastContainer  from "./Toast";
import  {toast} from "react-toastify"
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { BiUser } from "react-icons/bi";
import { BiEnvelope } from "react-icons/bi";
import { CiLock } from "react-icons/ci";
export default function Home() {
  const [username,setUsername]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [success,setSuccess]=useState(false)
  const [hide,setHide]=useState(false)
  const {apiUrl}=useContext(ApiContext)

  const handleUsername=(e:React.ChangeEvent<HTMLInputElement>)=>{
  const restrictedText=e.target.value.replace(/[^a-zA-Z._]/g, '')
  e.target.value=restrictedText
}
  const handleSubmit=async (e:React.FormEvent)=>{
      e.preventDefault();
     try{
     const response = await axios.post(`${apiUrl}/auth/`,{username,email,password},
      {
          headers:{ "Content-Type":"application/json" },
          withCredentials:true
      })
      window.localStorage.setItem("userInfo", JSON.stringify(response.data))
      toast.success("Successfully registered")
      setTimeout(()=>{
          setSuccess(true)  
      }, 1000)
  
      
     }
      catch(err){
          console.log(err)
          if(axios.isAxiosError(err)){
            toast.error(err?.response?.data.error || 'Something went wrong')
          }
   
}
}
useEffect(()=>{
  if(success){
      redirect('/login')
  }
},[success])

  return (
      <>
      
      <ToastContainer/>
      <div className="auth">
      <div className="container chat-login">
<div className="row justify-content-center">
  <div className="col-md-4">
  <form onSubmit={handleSubmit}>
  <div className="card authentication">
  <h3 className="text-center">Create Account</h3>
  <label className="">Username</label>
<div className=" mb-3 position-relative username-input">
<i className="btn  position-absolute  "><BiUser fontSize={18}/></i>
<input type="text" placeholder="Enter Username" className="w-full rounded-lg" name="username"  onChange={(e)=>setUsername(e.target.value)} onKeyUp={()=>handleUsername} required maxLength={15}/>
</div>

<label >Email</label>
<div className="mb-3 email-input position-relative">
<i className="btn  position-absolute "><BiEnvelope fontSize={18}/></i>
<input type="email" placeholder="Enter Email" className="w-full rounded-lg" name="email" onChange={(e)=>setEmail(e.target.value)}  required  />

</div>
<div>
<div className="pass-input d-flex justify-content-between">
<label className="">Password</label>
{/* <a className="forget-password ">Forgot password?</a> */}
</div>
<div className="position-relative">
<i className="btn  position-absolute  "><CiLock fontSize={20}/></i>
<input type={hide ? "password" : "text"} placeholder="Enter Password" className="w-full rounded-lg" onChange={(e)=>setPassword(e.target.value)} required />
{
  hide ? <i className="btn hide " onClick={()=>setHide(false)}><FaEyeSlash/></i> : <i className="btn hide " onClick={()=>setHide(true)}><FaEye/></i>
}

</div>
</div>
<div className="submit-btn mt-4">
<button type="submit" className="btn text-white">Register</button>

</div>
</div>
</form>
</div>
<p className="text-center text-white mt-3">Already have an account? <Link  className="underline" href='/login'>Login</Link></p>       
</div>
</div>
</div>

</>
  )
 
}


import { BsChatSquareText,BsEmojiAngry,BsEmojiSmile,BsImage,BsThreeDots, BsThreeDotsVertical} from "react-icons/bs";
import { IoCallOutline, IoSend, IoVideocamOutline } from "react-icons/io5";
import {HiOutlineMicrophone } from 'react-icons/hi2'
import { createContext, createElement, useContext, useEffect, useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import VideoCall from "./VideoCall";
import Call from "./Call";
import Sidebar from "./Sidebar";
import { FaSearch } from "react-icons/fa";
import io from "socket.io-client"
import { ThemeContext } from "./ThemeContext";
import axios from "axios";
import { Tooltip } from "react-tooltip";
import Message from "./Message";
import Header from "./Header";
const socket=io.connect("http://localhost:5000/")

 function Chat(){
  const {theme, handleTheme}=useContext(ThemeContext)
  const [called,setCalled]=useState(false)
  const [videoCalled,setVideoCalled]=useState(false)
  const [attach,setAttach]=useState(null)
  const [image,setImage]=useState()
  const [messages,setMessages]=useState([])
  const [item,setItem]=useState('')
  const [muted,setMuted]=useState(false)
  const [recording,setRecording]=useState(false)
  const [selectedUser,setSelectedUser]=useState(null)

  const navigate=useNavigate()

 const userInfo = JSON.parse(localStorage.getItem('userInfo'))
 const user=userInfo?.data
 const token=userInfo?.data?.token
 console.log(userInfo.data._id)

  

let mediaRecorder=null;
const handleInput=document.getElementById('msg')

 const emojii=[ 
  "😃",
  "😄",
  "😁",
  "😆",
  "😅",
  "🤣",
  "😂",
  "🙂",
  "🙃",
  "🫠",
  "😉",
  "😊",
  "😇",
  "🥰",
  "😍",
  "🤩",
  "😘",
  "😗",
]


const handleSubmit= async (event)=>{
event.preventDefault()

if(!item && !image) return;
console.log(selectedUser)
const notification=document.getElementById("notification")
if(muted){
  notification.play()
}
const newMessage={message:item, image, sender:user._id}
setMessages((prevMessage)=>[...prevMessage,newMessage])
socket.emit('message', newMessage)

try{
  const response=await axios.post(`http://localhost:5000/api/messages/${selectedUser._id}`, newMessage, {
    headers:{ 
      Authorization:`Bearer ${token}`,
      "Content-Type":"application/json" ,
          
    },
    withCredentials:true
  })
  const data= response.data
}
catch(err){
  console.log(err)
}   
      
setItem('')
setImage(null)
}

const handleEmojis=(e)=>{
  setItem(e.target.value)
}

const handleAttach=(e)=>{
  const file=e.target.files[0]
const reader=new FileReader()
if(file){
  reader.onload=()=>{
    setImage(reader.result)
  }
  reader.readAsDataURL(file)
}
}


  const handleAudio=async ()=>{
    setRecording(true)
    let stream=null;
     stream = await navigator.mediaDevices.getUserMedia({audio:true,})
    .then(function (stream){
       mediaRecorder= new MediaRecorder(stream)
       mediaRecorder.start()     
       let chunks=[]
       mediaRecorder.ondataavailable=(e)=>{
        chunks.push(e.data)
       }

       const stopped=document.querySelector(".stopped")
       stopped.onclick=()=>{
         mediaRecorder.stop()
         setRecording(false)
       }

     mediaRecorder.onstop=(e)=>{
     console.log("recording stopped")
     const blob=new Blob(chunks,{type:"audio/webm"})
     chunks=[]
     const audioURL=URL.createObjectURL(blob)
     const audio=new Audio(audioURL)
     audio.setAttribute("controls","")
     audio.play()
     const msn=document.getElementById('msn')
     msn.appendChild(audio)

     }
   })
   .catch((err)=>{
     console.log(err)
   })
 }

    return (
<>
    <div>
    {called ? <Call/>: <></>}
    {videoCalled ?  <VideoCall/>: <></>}
<div className="chat-row d-flex" style={{backgroundColor: theme==='dark' ? '#303841': "#ffffff", color: theme==='dark' ? 'white': "#212529",}}  >

<Sidebar messages={messages} setMessages={setMessages}   attach={attach} image={image} selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
        <div className="chat-body" style={{backgroundColor:theme==='dark'? '#262e35' : '#ffffff'}}>  
           {
          selectedUser ?   
          <>

          <Header theme={theme} muted= {muted} setMuted={setMuted} selectedUser={selectedUser} messages={messages} setMessages={setMessages}/> 
         
          <div className="conversation-body text-center overflow-auto" >
    {
  recording ? <div className="lines">
  <div className="line"></div>
  <div className="line"></div>
  <div className="line"></div>
  <div className="line"></div>
  <div className="line"></div>
  </div>
  : <></>
}

<Message messages={messages} user={user} />
      

</div>
<div className="msg-body p-3 p-lg-4">
<div className="row align-items-center">
        <div className="d-flex justify-content-center align-items-center icons col-md-2 col-4">     
      <div> 
        <label><BsImage fontSize={32} color="#6c757d"/>     
      <input type="file" id="files" onChange={handleAttach} accept="image/*" /></label>
      </div> 

      <div className="dropup col-md-2"  >     
      <button type="button" className="btn text-white" data-bs-toggle="dropdown" id="emojiMenu" ><BsEmojiSmile fontSize={32} color="#6c757d"/></button>
     <ul className="dropdown-menu emoji-menu" aria-labelledby="emojiMenu" >
      {
      emojii.map((emoji)=>{
        return(
          <li className="dropdown-item" ><button className="btn" onClick={handleEmojis} value={emoji} id="emojin">{emoji}</button></li>
        )

      })}
    
     </ul>

    
      </div>
      </div>
 
   <div className="col-md-10">
<form onSubmit={handleSubmit} >
  <div className="d-flex">
<div className="col-md-9">
  <input type="text" value={item} className="form-control form-control-lg" placeholder="Write a message..." id="msg" onChange={(e)=>setItem(e.target.value)}/>
 
 {/* {attach ?  <img src={item} /> : <div></div> } */}

  </div>  
  <audio src="beep.mp3" id="notification"></audio>
  <div className="col-md-2 col-4 d-flex align-items-center justify-content-center gap-3">
 <div className="audio">

 <button type="button" className="btn anchors" ><HiOutlineMicrophone  fontSize={32} onClick={handleAudio} id="record" color="#6c757d" /> </button> 

</div>


  <div className="send d-flex h-100"><button  type ="submit" className="btn btn-primary" ><IoSend className="stopped" fontSize={22}/></button></div>
  </div>  
  </div>
  </form>
  </div>  
  
  </div>
 
   
        </div>
          </>
          : <div className="starting">
            <h2 className="text-center text-white"> Select chat to start conversation</h2>
   
            
            </div>
         } 
        </div>
      
        </div>
        
        </div>
  
   
        </>
      
    )
}
export default Chat;
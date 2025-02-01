
import { BsChatSquareText,BsEmojiAngry,BsEmojiSmile,BsImage,BsSend,BsThreeDots, BsThreeDotsVertical} from "react-icons/bs";
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
import { socket } from "./Socket";
import { ApiContext } from "./ApiContext";
import Chats from "./Chats";
 function Chat(){
  const {theme, handleTheme}=useContext(ThemeContext)
  const [called,setCalled]=useState(false)
  const [videoCalled,setVideoCalled]=useState(false)
  const [attach,setAttach]=useState(null)
  const [image,setImage]=useState('')
  const [onlineUsers, setOnlineUsers]=useState([])
  const [messages,setMessages]=useState([])
  const [item,setItem]=useState('')
  const [muted,setMuted]=useState(false)
  const [recording,setRecording]=useState(false)
  const [selectedUser,setSelectedUser]=useState(null)
  const [showSidebar, setShowSidebar]=useState(true)
  const {apiUrl }=useContext(ApiContext)

  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const user=userInfo?.data
  const token=userInfo?.data.token
  
useEffect(()=>{
  if(user){
    socket.emit('join', user.username)
    socket.on('online', (users)=>{
       setOnlineUsers(users) 
       })
   }

}, [selectedUser])
 

const msg=document.getElementById('msg')

let mediaRecorder=null;

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
const formData=new FormData()
const handleAttach=(e)=>{
  const file=e.target.files[0]
  setAttach(file)
if(file){

formData.append('image', file)
const reader=new FileReader()
reader.onload=()=>{
  setImage(reader.result)
 
}
    reader.readAsDataURL(file)
  }

}

const handleSubmit= async (event)=>{
event.preventDefault()

 if(!item && !image) return;

const notification=document.getElementById("notification")
notification.play()
const newMessage={message:item, image:image, sender:user._id}
try{
 const response=await axios.post(`${apiUrl}/messages/${selectedUser._id}`, newMessage, {
    headers:{ 
      Authorization:`Bearer ${token}`,
      "Content-Type":"application/json" ,
          
    },
    withCredentials:true
  })
 const data= response.data
 setMessages((prevMessage)=>[...prevMessage,data])
 socket.emit('message', formData)
 console.log(messages)
}
catch(err){
  console.log(err)
}   
      
setItem('')
setImage('')
setAttach(null)
}

const handleEmojis=(e)=>{
  setItem(e.target.value)
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
{
  showSidebar ? 
  <>
  <Sidebar /> 
  <Chats messages={messages} setMessages={setMessages}   image={image} selectedUser={selectedUser} setSelectedUser={setSelectedUser} onlineUser={selectedUser ? onlineUsers.find((user)=>user.username===selectedUser.username) : null} setShowSidebar={setShowSidebar}/>
  </>
  :
  <></>

}

        <div className={showSidebar ? "chat-body col" : "chat-body col-12"} id="chatbody" style={{backgroundColor:theme==='dark'? '#262e35' : '#ffffff'}}>  
           {
          selectedUser ?   
          <>

  <Header theme={theme} muted= {muted} setMuted={setMuted} selectedUser={selectedUser} messages={messages} setMessages={setMessages} onlineUser={selectedUser ? onlineUsers.find((user)=>user.username===selectedUser.username) : null} setShowSidebar={setShowSidebar}/> 
         
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
<div className="msg-body p-3 p-lg-4" style={{borderTop: theme==='dark' ? '' : '1px solid #f0eff5'}}>
<form onSubmit={handleSubmit} >
<div className="d-flex align-items-center justify-center">

        <div className="justify-content-center align-items-center icons">     
    
      <div className="d-flex align-items-center">


 <label>
  <BsImage fontSize={32} color="#6c757d"/> 
  <input type="file" id="files" onChange={handleAttach} accept="image/*" />
  </label>

      <button type="button" className="btn text-white" data-bs-toggle="dropdown" id="emojiMenu" ><BsEmojiSmile fontSize={32} color="#6c757d"/></button>
      </div>
     <ul className="dropdown-menu emoji-menu" aria-labelledby="emojiMenu" >
      {
      emojii.map((emoji)=>{
        return(
          <li className="dropdown-item" ><button className="btn" onClick={handleEmojis} value={emoji} id="emojin">{emoji}</button></li>
        )
o
      })}
    
     </ul>

  
      </div>
     
   <div className="chat-input d-flex col-md-10 gap-2">
  <input type="text" value={item} className="w-full  px-4 py-2 rounded-lg" placeholder="Write a message..." id="msg"  onChange={(e)=>setItem(e.target.value)}/>
  {attach ?  <img src={item} /> : <div></div> }
  <audio src="beep.mp3" id="notification"></audio>
 <button type="button" className="anchors" ><HiOutlineMicrophone  fontSize={32} onClick={handleAudio} id="record" color="#6c757d" /> </button>
    <button  type ="submit" ><BsSend className="stopped" fontSize={24} color="#6c757d"/></button>
    </div>  

  </div>
 
  </form>
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
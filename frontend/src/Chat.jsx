
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

const handleAttach=(e)=>{
  const file=e.target.files[0]
  setAttach(file)
if(file){
const formData=new FormData()
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
o
      })}
    
     </ul>

    
      </div>
      </div>
 
   <div className="col-md-10 col-8">
<form onSubmit={handleSubmit} >
  <div className="d-flex">
<div className="col-md-9 ">
  <input type="text" value={item} className="w-full px-2 py-2 rounded-xl" placeholder="Write a message..." id="msg"  onChange={(e)=>setItem(e.target.value)}/>
 
  {attach ?  <img src={item} /> : <div></div> }

  </div>  
  <audio src="beep.mp3" id="notification"></audio>
  <div className="col-md-2 col-4 d-flex align-items-center justify-content-center gap-3">
 <div className="audio">

 <button type="button" className="anchors" ><HiOutlineMicrophone  fontSize={32} onClick={handleAudio} id="record" color="#6c757d" /> </button>
</div>
  <div className="send d-flex h-100"><button  type ="submit" className="" ><IoSend className="stopped" fontSize={22} color="#6c757d"/></button></div>
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
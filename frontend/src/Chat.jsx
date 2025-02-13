
import { BsChatSquareText,BsEmojiAngry,BsEmojiSmile,BsImage,BsSend,BsThreeDots, BsThreeDotsVertical} from "react-icons/bs";
import { IoCallOutline, IoSend, IoVideocamOutline } from "react-icons/io5";
import {HiOutlineMicrophone } from 'react-icons/hi2';
import { createContext, createElement, useContext, useEffect, useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import VideoCall from "./VideoCall";
import Call from "./Call";
import Sidebar from "./Sidebar";
import { FaRegStopCircle, FaSearch } from "react-icons/fa";
import io from "socket.io-client";
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
  const [record,setRecord]=useState(null)
  const [muted,setMuted]=useState(false)
  const [recording,setRecording]=useState(false)
  const [selectedUser,setSelectedUser]=useState({
    _id: '675dc4beb4693734af7983db', 
    email: 'memmedovturqay871@gmail.com', 
    username:'turgay_m', 
    password: '$2a$10$uiuCaKf4xVItAdrBDMkLeOWv9Hidw6x8YMKMvr24NweJmlRGcEq3a',
     role: 'Admin', 
     isBlocked: false,
    }
  )
  const [showSidebar, setShowSidebar]=useState(true)
  const [timer,setTimer]=useState(0)
  const {apiUrl }=useContext(ApiContext)
  const audioRef=useRef(null)
  const mediaRecorder=useRef(null)
  const mediaStream=useRef(null)
  const chunks=useRef([])
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const user=userInfo?.data
  const token=userInfo?.data.token
  const className=theme==='dark' ? 'background-light text-mute' : 'background-dark text-muted'
  const formClass=theme==='dark' ? 'form-dark' : 'form-light'
useEffect(()=>{
  if(user){
    socket.emit('join', user.username)
    socket.on('online', (users)=>{
       setOnlineUsers(users) 
       })
   }

}, [selectedUser])
 

 const emojii=[ 
  {
    id:1,
    text: "😃",
  },
  {
    id:2,
    text:"😄",
  },
  {
    id:3,
    text: "😁",
  },
  {
    id:4,
    text: "😆",
  },
  {
    id:5,
    text:  "😅",
  },
  {
    id:6,
    text:  "🤣", 
  },
  {
    id:7,
    text:   "😂",
  },
  {
    id:8,
    text:  "🙂",
  },
  {
    id:9,
    text:  "🙃",
  },
  {
    id:10,
    text:  "🫠",
  },
  {
    id:11,
    text: "😉", 
  },
  {
    id:12,
    text:  "😊", 
  }

 

 
  // "😇",
  // "🥰",
  // "😍",
  // "🤩",
  // "😘",
  // "😗",
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

const handleAudio=async ()=>{
  setRecording(true)
try{
    setTimer(0)
    const stream = await navigator.mediaDevices.getUserMedia({audio:true})
    mediaStream.current=stream 
    mediaRecorder.current= new MediaRecorder(stream)
    mediaRecorder.current.ondataavailable=(e)=>{  
      if(e.data.size>0){
        chunks.current.push(e.data)
      }
    
     }
     const timers = setInterval(()=>{
      setTimer((prev)=>prev+1)
    }, 1000)

   mediaRecorder.current.onstop=()=>{
   const blob=new Blob(chunks.current,{type:"audio/mp3"})
   const audioURL=URL.createObjectURL(blob)
   setRecord(audioURL)

   chunks.current=[]
   clearInterval(timers)
   }
   mediaRecorder.current.start()
 
  }
catch(err){
console.log(err)
}
}
const handleStop=()=>{
  setRecording(false)
  if(mediaRecorder.current){
    mediaRecorder.current.stop()
    mediaStream.current.getTracks().forEach(track=>track.stop())
 
  }
 
 
 }
 const handleAudioPlay = () => {
  if (audioRef.current) {
    audioRef.current.play()
  }
};
const handleEmojis=(e)=>{
  setItem(e.target.value)
}
const handleSubmit= async (event)=>{
event.preventDefault()
 if(!item && !image && !record) return;
const notification=document.getElementById("notification")
notification.play()
// const newMessage={message:item, image:image, audio:record, sender:user._id}
formData.append('message', item)
formData.append('image', image)
if(record){
  formData.append('audio', record)
}

formData.append('sender', user._id)
// formData.append('audio', blob, 'audio.mp3')
try{
 const response=await axios.post(`${apiUrl}/messages/${selectedUser._id}`, formData, {
    headers:{ 
      Authorization:`Bearer ${token}`,
      "Content-Type":"multipart/form-data" ,         
    },
    withCredentials:true
  })
 const data = response.data
 setMessages((prevMessage)=>[...prevMessage,data])
 socket.emit('message', formData)
}
catch(err){
  console.log(err)
}       
setItem('')
setImage('')
setRecord('')
setAttach(null)
}

 const formatTime=(time)=>{
  const minutes=Math.floor((time % 3600)/60)
  const seconds=Math.floor(time%60)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
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
<Message messages={messages} user={user}  audioRef={audioRef} handleAudioPlay={handleAudioPlay} theme={theme}/>

</div>
<div className="msg-body p-3 p-lg-4" style={{borderTop: theme==='dark' ? '' : '1px solid #f0eff5'}} >

<form onSubmit={handleSubmit} className={formClass}>
<div className="d-flex align-items-center justify-center">

        <div className="col-md-2 justify-content-center align-items-center icons">     
    
      <div className="d-flex justify-content-center align-items-center gap-2">
 <label>
  <a className="btn rounded-circle text-white">
  <BsImage fontSize={28} /> 
  </a>
  <input type="file" id="files" onChange={handleAttach} accept="image/*" />
  </label>
<div className="dropup">
      <a className="btn rounded-circle text-white" data-bs-toggle="dropdown" id="emojiMenu" ><BsEmojiSmile fontSize={28} /> </a>
     <ul className="dropdown-menu emoji-menu" aria-labelledby="emojiMenu" >
      {
      emojii.map((emoji)=>{
        return(
          <li className="dropdown-item" key={emoji.id}>
            <button className="btn" type="button" onClick={handleEmojis} value={emoji.text}>{emoji.text}</button>
            </li>
        )
      })}
    
     </ul>
     </div>
     </div>
      </div>
     
   <div className={ `${className} d-flex col-md-9 align-items-center gap-2 py-2 px-4 rounded-lg`}>
   {

recording ? 
<div className="d-flex gap-2">

  <button className="btn btn-danger" onClick={handleStop}> 

    <FaRegStopCircle fontSize={24}/>
  </button>
  <div className="btn d-flex justify-center align-items-center rounded">
{formatTime(timer)} 
  </div>
  </div>
 : <></>
  }
    {attach ?  <p className="attached">Attached</p> : <div></div> }
  <input type="text" value={item} className="w-full py-2 rounded-lg " placeholder="Write a message..." id="msg"  onChange={(e)=>setItem(e.target.value)}/>

  <audio src="beep.mp3" id="notification"></audio>
 <button type="button" className="anchors position-relative" ><HiOutlineMicrophone  fontSize={32} onClick={handleAudio} id="record"  /> 
 </button>
    <button  type ="submit" className="pr-2.5 "><BsSend className="stopped" fontSize={24} /></button>
    </div>  

  </div>
 
  </form>
        </div>
        
          </>
          : <div className="starting">
            {/* <h2 className="text-center text-white"> Select chat to start conversation</h2> */}
   
            
            </div>
         } 
        </div>
      
        </div>
        
        </div>
  
   
        </>
      
    )
}
export default Chat;
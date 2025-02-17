
import { BsChatSquareText,BsEmojiAngry,BsEmojiSmile,BsImage,BsSend,BsThreeDots, BsThreeDotsVertical} from "react-icons/bs";
import {HiOutlineMicrophone } from 'react-icons/hi2';
import { createContext, createElement, useContext, useEffect, useRef } from "react";
import { useState } from "react";
import Call from "./Call";
import Sidebar from "./Sidebar";
import { FaRegStopCircle, FaSearch } from "react-icons/fa";
import { ThemeContext } from "./ThemeContext";
import axios from "axios";
import Message from "./Message";
import Header from "./Header";
import { socket } from "./Socket";
import { ApiContext } from "./ApiContext";
import Chats from "./Chats";
import Swal from "sweetalert2";
import emojii from "./emojis";
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
  const [blocked, setBlocked]=useState(false)
  const [showSidebar, setShowSidebar]=useState(true)
  const [showChat, setShowChat]=useState(true)
  const [timer,setTimer]=useState(0)
  const [filteredUsers, setFilteredUsers]=useState([])
  const [users,setUsers]=useState([])
  const [allMessages,setAllMessages]=useState([])
  const {apiUrl, userInfo, token }=useContext(ApiContext)
  const user=userInfo?.data
  const [selectedUser,setSelectedUser]=useState(user)
  const audioRef=useRef(null)
  const mediaRecorder=useRef(null)
  const mediaStream=useRef(null)
  const chunks=useRef([])

  
  const className=theme==='dark' ? 'background-light text-mute' : 'background-dark text-muted'
  const formClass=theme==='dark' ? 'form-dark' : 'form-light'
 
  useEffect(()=>{
    const handleSize=()=>{
      if( showSidebar && window.innerWidth<=768){
        setShowChat(false)
        }
        else{
          setShowChat(true)
        }
    }
    
    handleSize()
      window.addEventListener("resize", handleSize);
    if(user){
      socket.emit('join', user.username)
      socket.on('online', (users)=>{
         setOnlineUsers(users) 
         })
     }
  
  }, [selectedUser])

  useEffect(()=>{
    fetch(`${apiUrl}/`)
    .then((res)=>res.json())
    .then((data)=>{
    setUsers(data)
    setFilteredUsers(data)
    })
    },[])


    
useEffect(()=>{  
  if (!selectedUser) return;
  const fetching=async()=>{           
  const response=await fetch(`${apiUrl}/messages/${selectedUser._id}`, {
  headers:{
  Authorization:`Bearer ${token}`
  }
  })
  const data=await response.json()
  setMessages(data)
  }
  fetching()  
  
  
  
  const fetchingAll=async()=>{           
    const response=await fetch(`${apiUrl}/messages/`, {
    headers:{
    Authorization:`Bearer ${token}`
    }
    })
    const data=await response.json()
    setAllMessages(data)
   
    }
    fetchingAll()  
    
  
  
  socket.on("message", (data)=>{     
  if(data.sender===selectedUser._id){
  setMessages((prevMessage)=>{
  if(!prevMessage.some((item)=>item.message===data.message)){
  return  [...prevMessage,data]
  }
      return prevMessage;
  });
  }
  })
  
  },[selectedUser,token])


 

 
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

 if(blocked===false){
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
else{
  Swal.fire({
    icon:"error",
    title:"User blocked",
    text:"You can't send message to this user",
    timer:3000
  })
}
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
<div className="chat-row d-flex" style={{backgroundColor: theme==='dark' ? '#303841': "#ffffff", color: theme==='dark' ? 'white': "#212529",}}  >
{
  showSidebar ? 
  <>
  <Sidebar /> 
  <Chats 
  messages={messages} setMessages={setMessages}   image={image} selectedUser={selectedUser} 
  setSelectedUser={setSelectedUser}
   onlineUser={selectedUser ? onlineUsers.find((user)=>user.username===selectedUser.username) : null}
    setShowSidebar={setShowSidebar} blocked={blocked} setBlocked={setBlocked} users={users} setUsers={setUsers}
    filteredUsers={filteredUsers} setFilteredUsers={setFilteredUsers} allMessages={allMessages}  setShowChat={setShowChat}
    />
  </>
  :
  <></>

}
{
  showChat===true ? <>
   <div className={showSidebar ? "chat-body col" : "chat-body col-12"} id="chatbody" style={{backgroundColor:theme==='dark'? '#262e35' : '#ffffff'}}>  
           {
          selectedUser ?   
          <>
  <Header theme={theme} muted={muted} setMuted={setMuted} selectedUser={selectedUser} messages={messages} setMessages={setMessages} onlineUser={selectedUser ? onlineUsers.find((user)=>user.username===selectedUser.username) : null} setShowSidebar={setShowSidebar} setShowChat={setShowChat}/> 
  
          <div className="conversation-body overflow-auto text-center" >
<Message messages={messages} user={user}  audioRef={audioRef} handleAudioPlay={handleAudioPlay} theme={theme} setMessages={setMessages}/>

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
            <h2 className="text-center text-white"> Select chat to start conversation</h2>
   
            
            </div>
         } 
        </div> 
  
  </>
  : <></>
}
       
      
        </div>
        
        </div>
  
   
        </>
      
    )
}
export default Chat;

import { BsChatSquareText,BsEmojiAngry,BsEmojiSmile,BsImage,BsThreeDots, BsThreeDotsVertical, BsTrash} from "react-icons/bs";
import { MdCallEnd, MdOutlineClose,MdOutlineDelete, MdOutlineInfo } from "react-icons/md";
import { GoUnmute,GoMute } from "react-icons/go";
import { useContext, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { ApiContext } from "./ApiContext";
const Header=({theme,messages,selectedUser,setMessages, onlineUser,setShowSidebar})=>{
  const msn=document.getElementById('msn')
const [muted,setMuted]=useState(false)
const userInfo = JSON.parse(localStorage.getItem('userInfo'))
const user=userInfo?.data
const token=userInfo?.data?.token
const handleMute=()=>{
  setMuted(!muted)
}
const {apiUrl}=useContext(ApiContext)
const handleDelete=async()=>{
  try{
    await axios.delete(`${apiUrl}/messages/675dc4beb4693734af7983db`, {
     headers:{
       "Content-Type":"application/json",
       "Authorization":`Bearer ${token}`
     }
    })
   setMessages([])
   }
   catch(err){
     console.log(err)
   }
   }
const handleBack=()=>{
  setShowSidebar(true)
}
  const className=theme==='dark' ? 'background-light text-white' : 'background-dark text-muted';
  const colors=theme==='dark' ? 'text-white' :'text-dark'

    return (
        <div className="chat-header  p-3 p-lg-4 d-flex align-items-center" style={{borderBottom: theme==='dark' ? '' : '1px solid #f0eff5'}}>
        <div className="col-md-4 col-9">
        <div className="chat-user">
        <div className="d-flex justify-content-center align-items-center">
        <div className="d-block d-lg-none">
<FaArrowLeft fontSize={24} onClick={handleBack}/>
          </div>
        <img src='user-profile.png' className="avatar "></img>
       <span className="status"></span>
    </div>
    <div>
       <h5>{selectedUser?.username}</h5>
    
    { onlineUser ?  <p className={`${colors}`}>Online</p> : <p className={`${colors}`}>Offline</p> }  
     
        <div className="text-muted" id="typing"></div>  
          {/* <span className="text-muted">online</span> */}
       

       </div>
        </div>
   
        </div>
      <div className="col-md-8 col-3">
      <div className="chat-user-nav d-flex justify-content-end">
        <ul className="d-flex">
{/* <li><button className="btn nav-btn text-muted"><IoVideocamOutline  fontSize={24} onClick={handleVideoCall}/></button></li>
<li><button className="btn nav-btn text-muted" onClick={handleCall}><IoCallOutline fontSize={20} /></button></li> */}
<li className="dropdown">
<button className={`${colors}`} role="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" >< BsThreeDotsVertical  fontSize={24} />
</button>
<ul className={`${className} dropdown-menu`} aria-labelledby="dropdownMenuButton" >
{/* <li className="dropdown-item"><a  href="#" className="text-muted">Contact info <span><MdOutlineInfo fontSize={28}/></span></a></li> */}
<li className="dropdown-item"  onClick={handleMute}>
{ muted=== false ? <a className=" d-flex gap-3"   >
Mute <span><GoMute fontSize={28}/></span> </a> : <a className="d-flex gap-3" >Unmute <span><GoUnmute fontSize={24}/></span> </a> }
</li>
<li className="dropdown-item"><a onClick={handleDelete}>Delete chat <span><BsTrash fontSize={24}/></span></a></li>

</ul>
</li>
</ul>
</div>
      </div>
      
    </div>
    )
}
export default Header;

import {  BsThreeDotsVertical, BsTrash} from "react-icons/bs";
import { GoUnmute,GoMute } from "react-icons/go";
import { useContext, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { ApiContext } from "./ApiContext";
const Header=({theme,messages,selectedUser,setMessages, onlineUser,setShowSidebar, setShowChat})=>{
const {apiUrl ,userInfo ,token}=useContext(ApiContext)
const [muted,setMuted]=useState(false)
let adminn='' 
if(userInfo){
  adminn = userInfo.data }
const handleMute=()=>{
  setMuted(!muted)
}
console.log(selectedUser)
const handleDelete=async()=>{
  try{
    await axios.delete(`${apiUrl}/messages/${selectedUser._id}`, {
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
  setShowChat(false)
}


    return (
        <div className="chat-header  p-3 p-lg-4 d-flex align-items-center" style={{borderBottom: theme==='dark' ? '' : '1px solid #f0eff5'}}>
        <div className="col-md-4 col-9">
        <div className="chat-user">
        <div className="d-flex justify-content-center align-items-center gap-1">
        <div className="d-block d-lg-none">
<FaArrowLeft fontSize={24} onClick={handleBack}/>
          </div>
          <link rel="preload" href="user-profile.png" as="image"/>
        <a className="position-relative">
        <img src={selectedUser?.image} className="avatar" alt="user"></img>
            { onlineUser ?    <span className="status bg-green-400"></span> : <span className="status bg-amber-300"></span> }   
      
          </a>
     
    </div>
    <div>
      {selectedUser?.username===userInfo?.data?.username
       ?     <h5>You</h5> : <h5>{selectedUser?.username}</h5>
      }
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
<button className={theme==='dark' ? 'text-white' :'text-dark'}  role="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" >< BsThreeDotsVertical  fontSize={24} />
</button>
<ul className={`${theme==='dark' ? 'background-light text-white' : 'background-dark text-muted'} dropdown-menu`} aria-labelledby="dropdownMenuButton" >
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
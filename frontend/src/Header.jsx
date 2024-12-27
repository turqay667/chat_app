
import { BsChatSquareText,BsEmojiAngry,BsEmojiSmile,BsImage,BsThreeDots, BsThreeDotsVertical} from "react-icons/bs";
import { MdCallEnd, MdOutlineClose,MdOutlineDelete, MdOutlineInfo } from "react-icons/md";
import { GoUnmute,GoMute } from "react-icons/go";
import { useState } from "react";

const Header=({theme,selectedUser})=>{
  const msn=document.getElementById('msn')
const [muted,setMuted]=useState(false)
const handleMute=()=>{
  setMuted(!muted)
}
const handleDelete=()=>{
  msn.innerHTML=`<div></div>`
  }

    return (
        <div className="chat-header mb-5 d-flex align-items-center" style={{borderBottom: theme==='dark' ? '' : '1px solid #f0eff5'}}>
        <div className="col-md-4">
        <div className="chat-user">
        <div className="avatar d-flex justify-content-center align-items-center">
        <img src='user-profile.png'></img>
       <span className="status"></span>
    </div>
    <div>
       <h5>{selectedUser.username}</h5>
      <p>Online</p>
        <div className="text-muted" id="typing"></div>  
          {/* <span className="text-muted">online</span> */}
       

       </div>
        </div>
   
        </div>
      <div className="col-md-8">
      <div className="chat-user-nav d-flex justify-content-end">
        <ul className="d-flex">
    
{/* <li><button className="btn nav-btn text-muted"><IoVideocamOutline  fontSize={24} onClick={handleVideoCall}/></button></li>
<li><button className="btn nav-btn text-muted" onClick={handleCall}><IoCallOutline fontSize={20} /></button></li> */}
<li className="dropdown">
<button className="btn text-muted" role="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" >< BsThreeDotsVertical  fontSize={24} />
</button>

<ul className="dropdown-menu" aria-labelledby="dropdownMenuButton" >
{/* <li className="dropdown-item"><a  href="#" className="text-muted">Contact info <span><MdOutlineInfo fontSize={28}/></span></a></li> */}
<li className="dropdown-item"  onClick={handleMute}>
{ muted=== false ? <a className="text-muted d-flex gap-3"   >
Mute <span><GoMute fontSize={28}/></span> </a> : <a className="text-muted d-flex gap-3" >Unmute <span><GoUnmute fontSize={28}/></span> </a> }
</li>
<li className="dropdown-item"><a onClick={handleDelete} className="text-muted">Delete chat <span><MdOutlineDelete fontSize={26}/></span></a></li>

</ul>
</li>
</ul>
</div>
      </div>
      
    </div>
    )
}
export default Header;
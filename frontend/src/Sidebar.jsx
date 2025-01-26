import { BsChatSquareText,BsThreeDots, BsThreeDotsVertical} from "react-icons/bs";
import {PiChats} from "react-icons/pi";
import { CgProfile } from "react-icons/cg";
import { CiCamera, CiDark, CiLight, CiLogout, CiSettings } from "react-icons/ci";
import { FiLogOut } from "react-icons/fi";
import { useState,useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "./ThemeContext";
import { socket } from "./Socket";


const Sidebar=()=>{
    const {theme,handleTheme}=useContext(ThemeContext)
    const navigate=useNavigate()
 
            

    const handleLogout=()=>{
       localStorage.removeItem("userInfo")
        navigate("/login")
         socket.disconnect()
        }
   

// const admin=users.find(item=>item.role==='Admin')
// const userId=adminn ? adminn._id : null

 
    return (
        <>
        <div className="sidebar" style={{backgroundColor: '#36404a'  }}    id="sidebar">
        <div className="logo pt-4"><a > <BsChatSquareText fontSize={34}/></a></div>
  <div className="navbar-menu">
<ul className="sidebar-menu nav">
<li><a className="btn" id="chat-tab" data-bs-toggle="tab" role="tab" data-bs-target="#chat" aria-selected="true"><PiChats fontSize={32}/></a></li>
{/* <li><a className="btn"  id="calls-tab" data-bs-toggle="tab"  role="tab" data-bs-target="#calls"   aria-selected="false"> <PiPhoneCall fontSize={32}/></a></li> */}
{/* <li><a className="btn"  id="contacts-tab" data-bs-toggle="tab"  role="tab" data-bs-target="#contacts"   aria-selected="false"> <RiContactsLine fontSize={32}/></a></li> */}
<li><a className="btn"  id="profile-tab" data-bs-toggle="tab"  role="tab" data-bs-target="#profile"   aria-selected="false"> <CgProfile fontSize={32}/></a></li>
<li><a className="btn"  id="settings-tab" data-bs-toggle="tab"  role="tab" data-bs-target="#settings"   aria-selected="false"> <CiSettings   fontSize={32}/></a></li>
</ul>

<ul className="sidebar-menu nav">
<li><a className="btn" >
  {theme==='dark' ? <CiLight fontSize={32}  onClick={handleTheme}/> : <CiDark fontSize={32} onClick={handleTheme}/> }
  
  </a></li>
<li><a className="btn" ><FiLogOut fontSize={30} onClick={handleLogout}/></a></li>
</ul>
</div>
</div>
     
        </>
    )
}
export default Sidebar;
import { BsChatSquareText,BsThreeDots, BsThreeDotsVertical} from "react-icons/bs";
import {PiChats} from "react-icons/pi";
import { CiCamera, CiDark, CiLight, CiLogout, CiSettings } from "react-icons/ci";
import { FiLogOut } from "react-icons/fi";
import { useState,useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "./ThemeContext";
import { socket } from "./Socket";
import { RiContactsLine } from "react-icons/ri";

const Sidebar=()=>{
    const {theme,handleTheme}=useContext(ThemeContext)
    const navigate=useNavigate()
 
          
    const handleLogout=()=>{
       localStorage.removeItem("userInfo")
        navigate("/login")
         socket.disconnect()
        }
   



 
    return (
        <>
        <div className="sidebar" style={{backgroundColor: '#36404a'  }}    id="sidebar">
        <div className="logo pt-2 mb-5"><a > <BsChatSquareText fontSize={34}/></a></div>
  <div className="navbar-menu">
<ul className="sidebar-menu nav">
<li><a className="btn" id="chat-tab" data-bs-toggle="tab" role="tab" data-bs-target="#chat" aria-selected="true"><PiChats /></a></li>
{/* <li><a className="btn"  id="calls-tab" data-bs-toggle="tab"  role="tab" data-bs-target="#calls"   aria-selected="false"> <PiPhoneCall fontSize={32}/></a></li> */}
<li><a className="btn"  id="contacts-tab" data-bs-toggle="tab"  role="tab" data-bs-target="#contacts"   aria-selected="false"> <RiContactsLine fontSize={32}/></a></li>
{/* <li><a className="btn"  id="profile-tab" data-bs-toggle="tab"  role="tab" data-bs-target="#profile"   aria-selected="false"> <CgProfile /></a></li> */}
<li><a className="btn"  id="settings-tab" data-bs-toggle="tab"  role="tab" data-bs-target="#settings"   aria-selected="false"> <CiSettings   /></a></li>
</ul>

<ul className="sidebar-menu nav">
<li><a className="btn" >
  {theme==='dark' ? <CiLight  onClick={handleTheme}/> : <CiDark fontSize={32} onClick={handleTheme}/> }
  
  </a></li>
<li><a className="btn" ><FiLogOut  onClick={handleLogout}/></a></li>
</ul>
</div>
</div>
     
        </>
    )
}
export default Sidebar;
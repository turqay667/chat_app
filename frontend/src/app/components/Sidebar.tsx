
import {PiChats} from "react-icons/pi";
import {  CiDark, CiLight, CiSettings } from "react-icons/ci";
import { FiLogOut } from "react-icons/fi";
import { use} from "react";
import { ThemeContext } from "../ThemeContext";
import { socket } from "../Socket";
import { RiContactsLine } from "react-icons/ri";
import { redirect } from "next/navigation";

const Sidebar=()=>{
    const {theme,handleTheme}=use(ThemeContext)

    const handleLogout=()=>{
       localStorage.removeItem("userInfo")
       socket.disconnect()
        redirect("/login") 
      }
      
    return (
        <>
        <div className="sidebar"  id="sidebar">
          {/* <div className="logo"><a > <BsChatSquareText fontSize={34}/></a></div> */}
          <div className="navbar-menu">
            <ul className="sidebar-menu nav" role="tablist">
              <li role="list"><a title="chats" className="btn active" id="chat-tab" data-bs-toggle="tab" role="tab" data-bs-target="#chat"  aria-selected="true"  ><PiChats /></a></li>
              <li role="list"><a title="contacts"  className="btn"  id="contacts-tab" data-bs-toggle="tab"  role="tab" data-bs-target="#contacts"   aria-selected="false" > <RiContactsLine fontSize={32}/></a></li>
              <li role="list"><a title="settings" className="btn"  id="settings-tab" data-bs-toggle="tab"  role="tab" data-bs-target="#settings"   aria-selected="false" > <CiSettings   /></a></li>
            </ul>
            <ul className="sidebar-menu nav" role="tablist">
              <li role="list"><a className="btn">{theme==='dark' ? <CiLight  onClick={handleTheme}/> : <CiDark fontSize={32} onClick={handleTheme}/> }</a></li>
              <li role="list"><a title="logout" className="btn" ><FiLogOut  onClick={handleLogout}/></a></li>
            </ul>
          </div>
        </div>   
        </>
    )
}
export default Sidebar;
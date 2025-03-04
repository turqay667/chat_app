
import { BiSearch } from "react-icons/bi";
import { useState, useContext} from "react";
import { ThemeContext } from "../ThemeContext";
import Settings from "./Settings";
import Contacts from "./Contacts"
import Image from "next/image";
import type { Message } from "./Messages";
import { AuthContext } from "../AuthContext";

export type User={
    _id:number,
    username:string,
    token:string,
    about:string,
    image:string
}

type Props={
    users:User[],
    selectedUser:User | null,
    allMessages:Message[],
    filteredUsers:User[],
    setFilteredUsers:React.Dispatch<React.SetStateAction<User[]>>,
    setSelectedUser:(selected:User)=>void
    setShowSidebar:(showSidebar:boolean)=>void
    blocked:boolean,
    setBlocked:(blocked:boolean)=>void,
    setShowChat:(showChat:boolean)=>void
}
const Chats=({allMessages, selectedUser,setSelectedUser, setShowSidebar, blocked, setBlocked , filteredUsers,setFilteredUsers, users, setShowChat}:Props)=>{
const {theme}=useContext(ThemeContext)
const {user}=useContext(AuthContext)
const [search, setSearch]=useState('')


const handleSearch=()=>{
if(search===''){
setFilteredUsers(users)
}
const filterUsers = users.filter((item:User)=>item.username.toLowerCase().includes(search.toLowerCase()))
setFilteredUsers(filterUsers)
}
const handleUser=()=>{
if(window.innerWidth<=768){
setShowSidebar(false)
setShowChat(true)
const chat=document.getElementById('nav-tabContent')
if(chat){
    chat.classList.remove('col-12')
}}}
    return(
        <>
           <div className={`${theme==='dark' ? 'darkBg': 'ligthBg'} col-md-3 col-12 chats tab-content`} id="nav-tabContent"  >
        <div className="sidebar-left tab-pane fade show active" id="chat" role="tabpanel" aria-labelledby="chat-tab">
            <div className="header">
                <div className="mb-4">
                <h4>Chats</h4>
                </div>          
            <form className="search-form d-flex align-items-center" onSubmit={()=>handleSearch}>
            <input type="text" className={`${theme==='dark' ? 'background-light' : 'background-dark'} w-full  px-4 py-2`} placeholder="Search here..." onChange={(e)=>setSearch(e.target.value)}/>        
          <a type="submit" className=" text-muted"> <BiSearch fontSize={24}/></a>
           </form>
            </div>     
           <div className="sidebar-body">
           <div className="users">    
           {
              filteredUsers.map((item)=>{
           const userMessages=allMessages.filter((message:Message)=>
            message.sender===item._id && message.receiver===user?._id ||
           message.sender===user?._id && message.receiver===item._id 
          )
           const lastMessage=userMessages.slice(-1)[0]
return (        
<div className={theme==='dark' ? 'user-profile border-secondary bs-light' : 'user-profile border-red bs-dark'} onClick={()=> setSelectedUser(item)}  key={item._id}>
         
            <div className="user position-relative" onClick={handleUser}>
            <div className="d-flex align-items-center justify-content-between">                 
              <div className="notifies d-flex pl-3 justify-content-between">                                     
           <a className="position-relative">
            <Image src={`/${item.image}`}  className="avatar"  alt="user" width={100} height={100}/>
            </a>              
                <div className="d-flex flex-column justify-center">
               { item.username===user?.username  ?       <h5 className="text-truncate">You</h5>      
               :    <h5 className="text-truncate">{item.username}</h5>  } 

        <div className={theme==='dark' ? 'text-mute' :'text-dark'}>
          {
          lastMessage ? lastMessage.message : ''
          }
          </div>
        </div>      
        </div>      
                    
                <div>
   {/* <h5 className="sented">{new Date(msg.createdAt).toLocaleTimeString('en-US', {
          hour:"numeric",
          minute:"numeric"

})}</h5> */}
<div ></div>
    </div>
                </div>
      
  
            </div>
       </div>
)


   })
  }
   </div>
   
       
           </div>
        </div>

<Contacts filteredUsers={filteredUsers} setFilteredUsers={setFilteredUsers} handleSearch={handleSearch} blocked={blocked} setBlocked={setBlocked} selectedUser={selectedUser} setSelectedUser={setSelectedUser} setSearch={setSearch}/>
<Settings setFilteredUsers={setFilteredUsers}/>
        </div>
        </>
    )
}
export default Chats;
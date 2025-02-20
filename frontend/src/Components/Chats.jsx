
import { BiMessage, BiSearch } from "react-icons/bi";
import { useState,useEffect,useRef, useContext, Suspense } from "react";
import { ThemeContext } from "../Context.jsx/ThemeContext";
import { ApiContext } from "../Context.jsx/ApiContext";
import axios from "axios";
import Settings from "./Settings";
import Contacts from "./Contacts"
import Loading from "../Loading";
const Chats=({allMessages, selectedUser,setSelectedUser, setShowSidebar, blocked, setBlocked , filteredUsers,setFilteredUsers, users, setShowChat})=>{
const {apiUrl, token}=useContext(ApiContext)
const {theme,handleTheme}=useContext(ThemeContext)
const [userInfo,setUserInfo]=useState(JSON.parse(localStorage.getItem('userInfo')))
const [search,setSearch]=useState('')
const adminn = userInfo?.data

const [about,setAbout]=useState(adminn?.about || 'change your thoughts and you change your world')
const [loading,setLoading]=useState(true)
const handleSearch=(e)=>{
e.preventDefault()
if(search===''){
setFilteredUsers(users)
}

const filterUsers= users.filter((item)=>
item.username.toLowerCase().includes(search.toLowerCase())
)
setFilteredUsers(filterUsers)
}
console.log(filteredUsers)
const handleUser=()=>{
if( window.innerWidth<=768){
setShowSidebar(false)
setShowChat(true)
const chat=document.getElementById('nav-tabContent')
chat.classList.remove('col-12')
}
}

    return(
        <>
           <div className="col-md-3 col-12 chats tab-content" id="nav-tabContent"  style={{backgroundColor: theme==='dark' ? '#303841': "#f5f7fb"  }}>
        <div className="sidebar-left tab-pane fade show active" id="chat" role="tabpanel" aria-labelledby="chat-tab">
            <div className="header">
                <div className="mb-4">
                <h4>Chats</h4>
                </div>          
            <form className="search-form d-flex align-items-center" onSubmit={handleSearch}>
            <input type="text" className={`${theme==='dark' ? 'background-light' : 'background-dark'} w-full  px-4 py-2`} placeholder="Search here..." onChange={(e)=>setSearch(e.target.value)}/>        
          <a type="submit" className=" text-muted"> <BiSearch fontSize={24}/></a>
           </form>
            </div>     
           <div className="sidebar-body">
           <div className="users">    
          
        
           {/* {
              loading ? <Loading/> : (
                <></>
              )
            }       */}
           {
              filteredUsers.map((item)=>{
           const userMessages=allMessages.filter((message)=>
            message.sender===item._id && message.receiver===adminn._id ||
           message.sender===adminn._id && message.receiver===item._id 
          )
           const lastMessage=userMessages.slice(-1)[0]
return (        
<div className={theme==='dark' ? 'user-profile border-secondary bs-light' : 'user-profile border-red bs-dark'} onClick={()=> setSelectedUser(item)}  key={item._id}>
         
            <div className="user position-relative" onClick={handleUser}>
            <div className="d-flex align-items-center justify-content-between">                 
              <div className="notifies d-flex pl-3 justify-content-between">                                     
           <a className="position-relative">
            <img className="avatar" src={item.image}  alt="user"></img>
            </a>              
                <div className="d-flex flex-column justify-center">
               { item.username===adminn.username  ?       <h5 className="text-truncate">You</h5>      
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
<div style={{opacity:0}}>'</div>
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

<Contacts filteredUsers={filteredUsers} setFilteredUsers={setFilteredUsers} handleSearch={handleSearch} blocked={blocked} setBlocked={setBlocked} selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
<Settings setFilteredUsers={setFilteredUsers}/>

    
        
        </div>
        </>
    )
}
export default Chats;
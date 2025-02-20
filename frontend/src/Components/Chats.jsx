
import { BiSearch } from "react-icons/bi";
import { useState,useEffect,useRef, useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import { ApiContext } from "../ApiContext";
import axios from "axios";
import  Swal from "sweetalert2";
import Settings from "./Settings";
import Contacts from "./Contacts"

const Chats=({allMessages,selectedUser,setSelectedUser, onlineUser,setShowSidebar, blocked, setBlocked , filteredUsers,setFilteredUsers, users, setUsers, setShowChat})=>{
const {apiUrl, token}=useContext(ApiContext)
const {theme,handleTheme}=useContext(ThemeContext)
 const [userInfo,setUserInfo]=useState(JSON.parse(localStorage.getItem('userInfo')))
const [search,setSearch]=useState('')
const adminn = userInfo?.data
const [about,setAbout]=useState(adminn?.about || 'change your thoughts and you change your world')

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

const handleUser=()=>{
if( window.innerWidth<=768){
setShowSidebar(false)
setShowChat(true)
const chat=document.getElementById('nav-tabContent')
chat.classList.remove('col-12')
}
}



const handleDelete= async ()=>{

  try{
    await axios.delete(`${apiUrl}/users/${selectedUser._id}`,
      {
      headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${token}`
      }
    })
    setFilteredUsers(prevUsers=>(prevUsers.filter((user)=>user._id!==selectedUser._id)))
    Swal.fire('User deleted successfully')
  }
  catch(err){
    console.error(err)
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
           {
              filteredUsers.map((user)=>{
             
return (        
<div className={theme==='dark' ? 'user-profile border-secondary bs-light' : 'user-profile border-red bs-dark'} onClick={()=> setSelectedUser(user)}  key={user._id}>
            <div className="user position-relative" onClick={handleUser}>
      
            {
      allMessages.length>0 && allMessages.filter((message)=>
        message.sender===user._id || message.receiver===user._id).slice(-1).map((msg)=>{
          return (
            <div key={msg._id} className="d-flex align-items-center justify-content-between">                 
              <div className="notifies d-flex pl-3 justify-content-between">                                     
           <a className="position-relative">
            <img className="avatar" src={user.image}  alt="user"></img>
            {/* <span className="status"></span> */}
            </a>
              
                <div className="d-flex flex-column justify-center">
               { user.username===adminn.username  ?       <h5 className="text-truncate">You</h5>      
               :    <h5 className="text-truncate">{user.username}</h5>  } 
        <div className={theme==='dark' ? 'text-mute' :'text-dark'}>
          {msg.message}
          </div>
        </div>      
        </div>      
                    
                <div>
   <h5 className="sented">{new Date(msg.createdAt).toLocaleTimeString('en-US', {
          hour:"numeric",
          minute:"numeric"

})}</h5>
<div style={{opacity:0}}>'</div>
    </div>
                </div>
        
      )
    }) 
  }

   
            </div>
       </div>
)


   })
  }
   </div>
   
       
           </div>
        </div>
        <div className="sidebar-left tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
        <div className="header">
                <div className="mb-2 d-flex justify-content-between">
               <div>
                <h4>My Profile</h4>
                </div>
                </div>
           
                </div>


        <div className={theme==='dark' ? 'user-profile border-secondary' : 'user-profile border-red'}>
          {
            adminn ?
            <>
             <div className="profile-img d-flex justify-content-center">
<img src={adminn.image} className={`${theme==="dark" ? 'border-lighted' :'border-grey'} rounded-circle avatar`} alt="user"/>
</div>
<h5 className="text-center pt-2">{adminn.username}</h5> 
            </> 
            : <></>
          }
  

</div> 
<div className="user-content">
    <p id="about" className={theme==='light' ? 'text-muted' : 'text-mute'}> {about}</p> 
 {/* <div className="media mt-4">
  <div className=" d-flex justify-content-between mb-3">
<h5>Media </h5>
<h6>Show all</h6>
</div>
<div className="media-img row">

   {messages.filter((item)=>item.image).length>0 ?  (messages.filter((item)=>item.image).map(item=>{   
     return (
        <div key={item._id} className="col-md-3">
       <img src={item.image}/> 
        </div>
     
      ) 

    }))
   
    :  <p className="text-center mt-5">Nothing to show</p> 
  } 
</div>
</div>  */}
</div>
      
</div>
<Contacts filteredUsers={filteredUsers} setFilteredUsers={setFilteredUsers} handleSearch={handleSearch} blocked={blocked} setBlocked={setBlocked}  setSelectedUser={setSelectedUser}/>
<Settings/>

    
        
        </div>
        </>
    )
}
export default Chats;
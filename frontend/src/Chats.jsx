import { PiPhoneCall } from "react-icons/pi";
import { RiContactsLine } from "react-icons/ri";
import { CiEdit, CiSquarePlus } from "react-icons/ci";
import { BiSearch } from "react-icons/bi";
import { FaPenSquare, FaRegEdit } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { useState,useEffect, useContext } from "react";
import { ThemeContext } from "./ThemeContext";
import { ApiContext } from "./ApiContext";
import { socket } from "./Socket";
import axios from "axios";
const Chats=({messages,setMessages,selectedUser,setSelectedUser, onlineUser,setShowSidebar })=>{
const {apiUrl}=useContext(ApiContext)
const {theme,handleTheme}=useContext(ThemeContext)
const [users,setUsers]=useState([])
const [password,setPassword]=useState('12345678')
const [phone,setPhone]=useState('')
const [filteredUsers, setFilteredUsers]=useState([])
const [about,setAbout]=useState('“When you change your thoughts, remember to also change your world.” —Norman Vincent Peale')
const [saved,setSaved]=useState(false)
const [image,setImage]=useState('user-profile.png')
const [search,setSearch]=useState('')
const [edit,setEdit]=useState(false)
const [allMessages,setAllMessages]=useState([])


const muted=theme==='dark' ? 'text-mute' :'text-dark'
const border=theme==="dark" ? 'border-lighted' :'border-grey'
const userInfo = JSON.parse(localStorage.getItem('userInfo'))
let adminn=''
if(userInfo){
adminn =userInfo.data
                    }
const user=userInfo?.data
const token=userInfo?.data?.token
const [username,setUsername]=useState(user.username)
// const admin=users.find(item=>item.role==='Admin')
const userId=adminn ? adminn._id : null

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

const textarea=document.getElementById('about')

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


const handleAbout=(e)=>{
textarea.focus()
setSaved(true)

}
console.log(allMessages)
const handleContacts=(e)=>{
e.preventDefault()
}

const handleUser=()=>{
if(selectedUser && window.innerWidth<=768){
setShowSidebar(false)
const chat=document.getElementById('nav-tabContent')
chat.classList.remove('col-12')
}
}
const handleImage = (e)=>{
const file=e.target.files[0]

const reader= new FileReader()
reader.onloadend=()=>{
// const updatedUser={...adminn,image:reader.result}
// localStorage.setItem("userInfo", JSON.stringify({data:updatedUser}))
setImage(reader.result)

try{
axios.put(`${apiUrl}/profile/${userId}`, {image},{
    headers:{
     Authorization:`Bearer ${token}`,
    "Content-Type":"application/json",
  
    }
})
}
catch(err){
    console.log(err)
}
}
reader.readAsDataURL(file)
}
const handleEdit=()=>{
  setEdit(true)
}
const handleProfile=async(e)=>{
e.preventDefault()
console.log('edited')
const updatedUser={username, password}

try{
await axios.put(`${apiUrl}/profile/${userId}`, updatedUser, {
    headers:{
    "Content-Type":"application/json",
    "Authorization":`Bearer ${token}`
    }
})

}
catch(err){
    console.log(err)
}
}
    return(
        <>
           <div className="col-md-3 col-12 chats tab-content overflow-auto" id="nav-tabContent"  style={{backgroundColor: theme==='dark' ? '#303841': "#f5f7fb"  }}>
        <div className="sidebar-left tab-pane fade show active" id="chat" role="tabpanel" aria-labelledby="chat-tab">
            <div className="header">
                <div className="mb-4">
                <h4>Chat</h4>
                </div>          
            <form className="search-form d-flex align-items-center" onSubmit={handleSearch}>
            <input type="text" className={`${theme==='dark' ? 'background-light' : 'background-dark'} w-full rounded-full px-4 py-2`} placeholder="Search here..." onChange={(e)=>setSearch(e.target.value)}/>        
          <a type="submit" className=" text-muted"> <BiSearch fontSize={24}/></a>
           </form>
            </div>     
           <div className="sidebar-body">
           <div className="users">           
           {
              filteredUsers.map((user)=>{
                console.log(user)
            
return (        
<a className={theme==='dark' ? 'user-profile border-secondary' : 'user-profile border-red'} onClick={()=> setSelectedUser(user)}  key={user._id}>
            <div className="user position-relative d-flex justify-between" onClick={handleUser}>
      
 
              
          
  
            {
      allMessages.length>0 && allMessages.filter((message)=>
        message.sender===user._id || message.receiver===user._id).slice(-1).map((msg)=>{
          return (
            <>
                       
              <div className="notifies d-flex pl-3 justify-content-between">
           
                {user.username===adminn ? 
            
            
            <img src={`http://localhost:5000${adminn.image}`} className="admin-img"/> :    
            <img className="avatar" src='user-profile.png' ></img>}
               
                <div className="d-flex flex-column justify-center">
                <h5 className="text-truncate">{user.username}</h5>   
        <div className={muted}>
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
                </>
        
      )
    }) 
  }

   
            </div>
       </a>
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
<img src={image} className={`${border} rounded-circle avatar`}/>
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
</div> */}
</div>
      
</div>
<div className="sidebar-left tab-pane fade" id="settings" role="tabpanel" aria-labelledby="settings-tab">
        <div className="header">
                <div className="mb-2 d-flex justify-content-between">
               <div>
                <h4>Settings</h4>
                </div>
           
                </div>
           
                </div>

        <div>
        <form onSubmit={handleProfile} id="prof">
          {
         
            adminn ? (
            
            <>
            <div className={theme==='dark' ? 'user-profile border-secondary' : 'user-profile border-red'}>

          
             <div className="profile-img d-flex justify-content-center">
             

       
<img src={image} className={`${border} rounded-circle avatar`}></img>
  <label>  <input type="file" accept="image" name="image" onChange={handleImage}/>
  {/* <a>
    <MdOutlineEdit fontSize={28} />
    </a> */}
  </label>
</div>
</div>
{/* <h5 className="">{adminn.username}</h5>  */}
{/* <div className="dropdown pb-4">
<a className="text-muted dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Available</a>
<ul className="dropdown-menu">
<li><a className="dropdown-item"> Busy</a></li>
<li><a className="dropdown-item"> Sleeping</a></li>
<li><a className="dropdown-item"> Don't disturb</a></li>
</ul>
</div> */}

<div className='user-content'>
    <label className={ theme==='light' ? 'text-muted' : 'text-mute' }>About</label>

      <div className="d-flex align-items-center"> 
        <textarea className="w-full pb-3" id="about" value={about} rows={3}  cols={3} onChange={(e)=>setAbout(e.target.value)} /> 
 {/* <span className="btn btn-success text-white">
    <MdOutlineEdit fontSize={24}  onClick={handleEdit}/>
    </span> */}
    </div>
    <label className={theme==='light' ? 'text-muted' : 'text-mute'}>Name</label>  
    <div className="d-flex justify-content-evenly" >
         <input className="w-full"   value={username}   onChange={(e)=>setUsername(e.target.value)}/>
  <a>
    <CiEdit   onClick={handleEdit}/>
    </a>
    
    </div>
   
    <label className={theme==='light' ? 'text-muted' : 'text-mute'}>Password</label>
    <div className="d-flex justify-around">
    <input className="w-full font-size-14" type="password" value={password}  onChange={(e)=>setPassword(e.target.value)}/>
     <a>
    <CiEdit  onClick={handleEdit}/>
    </a>
    </div>
    <div className="text-center mt-3">
      { edit ? <button type="submit" className="btn btn-success text-white">Save</button> : <div></div>}
    </div>
</div>
            </> 
            )
            : <></>
          }
   

</form>
</div> 


</div>
 

        <div className="sidebar-left tab-pane fade" id="contacts" role="tabpanel" aria-labelledby="contacts-tab">
        <div className="header">
        <div className="mb-4 d-flex justify-content-between">
               <div>
                <h4>Contacts</h4>
                </div>
                
               <div>
                
                <button className="btn" type="button" data-bs-toggle="modal" data-bs-target="#contactsModal" ><CiSquarePlus fontSize={32}/></button>
              <div className="modal fade" id="contactsModal" tabIndex="-1" aria-labelledby="contactsModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
               <h5 className="modal-title">Add new contact</h5>
               <button className="btn-close" type="button" aria-label="Close" data-bs-dismiss="modal"></button>
                </div>
                <form >
              <div className="modal-body">

{/* <label>Emaile</label>
<input type="text" placeholder="Enter Email" className="w-full" onChange={(e)=>setEmail(e.target.value)}/> */}
<label >Phone </label>
<input  type="number" placeholder="Enter Phone Number" className="w-full mt-3 mb-3" onChange={(e)=>setPhone(e.target.value)}/>
<label >Name</label>
<input type="text" placeholder="Enter Name" className="w-full mt-3 mb-3" onChange={(e)=>setName(e.target.value)}/>

              </div>
              
</form>
              <div className="modal-footer">
                <button className="btn btn-success" type="submit" onClick={handleContacts}>Submit</button>
              </div>
              </div>
                        
              </div>
                </div> 
                </div>
             
        </div>
      
        <form className="search-form d-flex align-items-center">
            <input type="text" className="w-full" placeholder="Search contacts..."/>
          <a type="submit" className=" text-muted"> <BiSearch fontSize={24}/></a>
           </form>
        </div>
        </div>
        </div>
        </>
    )
}
export default Chats;
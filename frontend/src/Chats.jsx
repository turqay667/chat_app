import { PiPhoneCall } from "react-icons/pi";
import { RiContactsLine } from "react-icons/ri";
import { CiEdit, CiSquarePlus } from "react-icons/ci";
import { BiBlock, BiSearch } from "react-icons/bi";
import { FaPenSquare, FaRegEdit } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { BsThreeDotsVertical, BsTrash } from "react-icons/bs";
import { useState,useEffect,useRef, useContext } from "react";
import { ThemeContext } from "./ThemeContext";
import { ApiContext } from "./ApiContext";
import { socket } from "./Socket";
import axios from "axios";
import  Swal from "sweetalert2";
import { CgUnblock } from "react-icons/cg";

const Chats=({messages,setMessages,selectedUser,setSelectedUser, onlineUser,setShowSidebar, blocked, setBlocked })=>{
const {apiUrl}=useContext(ApiContext)
const {theme,handleTheme}=useContext(ThemeContext)
const [users,setUsers]=useState([])
const [password,setPassword]=useState('12345678')
const [userInfo,setUserInfo]=useState(JSON.parse(localStorage.getItem('userInfo')))
const [filteredUsers, setFilteredUsers]=useState([])
const [about,setAbout]=useState('“When you change your thoughts, remember to also change your world.” —Norman Vincent Peale')
const [saved,setSaved]=useState(false)
const [image,setImage]=useState('user-profile.png')
const [search,setSearch]=useState('')
const [edit,setEdit]=useState(false)
const [allMessages,setAllMessages]=useState([])
const [username,setUsername]=useState(userInfo?.data?.username || 'undefined')


const border=theme==="dark" ? 'border-lighted' :'border-grey'
const className=theme==='dark' ? 'background-light text-white' : 'background-dark text-muted';

  let adminn=''
if(userInfo){
  adminn = userInfo.data }
const token=userInfo?.data?.token
const userId=adminn ? adminn._id : null
const userRef=useRef(null)
// const passRef=useRef(null)
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


const handleSave=()=>{
  Swal.fire({
    title:"Save changes",
    text:"Are you sure?",
    icon:"warning"  })
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
const handleEdit=(field)=>{
  setEdit(true)
  if(userRef.current){
    userRef.current.focus()
  }
  // if(field==="password" && passRef.current){
  //   passRef.current.focus()
  // }


}
const handleProfile=async(e)=>{
  setEdit(false)
e.preventDefault()
const updatedUser={username, password}

try{
await axios.put(`${apiUrl}/profile/${userId}`, updatedUser, {
    headers:{
    "Content-Type":"application/json",
    "Authorization":`Bearer ${token}`
    }
})
  setUserInfo({data:{...adminn, username}})
  localStorage.setItem('userInfo',JSON.stringify({data:{...adminn,username}}))
}
catch(err){
    console.log(err)
}


}
const deleteUser=()=>{
  Swal.fire({
    title:"Delete contact",
    text:"Are you sure?",
    icon:"warning",
    showCancelButton:true,
    confirmButtonText:"Yes"
    
  }).then((result)=>{
    if(result.isConfirmed){
      handleDelete()
    }
  })
}
const handleDelete=async ()=>{

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
const handleBlock=()=>{
  Swal.fire({
    icon:"error",
    text:"User blocked",
    timer:3000
  })
setBlocked(true)
}
const handleUnblock=()=>{
  setBlocked(false)
  Swal.fire({
    title:"Block removed",
    icon:"success"  })

}
    return(
        <>
           <div className="col-md-3 col-12 chats tab-content overflow-auto" id="nav-tabContent"  style={{backgroundColor: theme==='dark' ? '#303841': "#f5f7fb"  }}>
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
            <div className="user position-relative d-flex justify-between" onClick={handleUser}>
      
            {
      allMessages.length>0 && allMessages.filter((message)=>
        message.sender===user._id || message.receiver===user._id).slice(-1).map((msg)=>{
          return (
            <>                 
              <div className="notifies d-flex pl-3 justify-content-between" >                          
                  {/* <img src={`http://localhost:5000${adminn.image}`} className="admin-img" alt="admin" loading="lazy"/>  */}             
           <a className="position-relative">
            <img className="avatar" src='user-profile.png'  alt="user"></img>
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
                </>
        
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
<img src={image} className={`${border} rounded-circle avatar`} alt="user"/>
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
             

       
<img src={image} className={`${border} rounded-circle avatar`} alt="user"></img>
  <label>  <input type="file" accept="image" name="image" onChange={handleImage}/>
  {/* <a>
    <MdOutlineEdit fontSize={28} />
    </a> */}
  </label>

</div>
<h5 className="text-center pt-2">{adminn.username}</h5> 
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
        <textarea className="w-full pb-3" id="about" value={about} rows={3}  cols={3} onChange={(e)=>setAbout(e.target.value)} disabled/> 
 {/* <span className="btn btn-success text-white">
    <MdOutlineEdit fontSize={24}  onClick={handleEdit}/>
    </span> */}
    </div>
    <label className={theme==='light' ? 'text-muted' : 'text-mute'}>Name</label>  
    <div className="d-flex justify-content-evenly align-items-center" >
         
       
         <input className="w-full" ref={userRef}  value={username}  disabled={edit ? false : true}  onChange={(e)=>setUsername(e.target.value)}/>
         
       
         <a className={theme==='dark' ? 'btn btn_light' : "btn btn_dark"}>
    <CiEdit   onClick={handleEdit}/>
    </a>    
    </div>
   
    <label className={theme==='light' ? 'text-muted' : 'text-mute'}>Password</label>
    <div className="d-flex justify-around align-items-center">
    <input className="w-full font-size-14 " type="password" value={password}  onChange={(e)=>setPassword(e.target.value)} disabled={edit ? false : true} />
     <a className={theme==='dark' ? 'btn btn_light' : "btn btn_dark "}>
    <CiEdit  onClick={handleEdit}/>
    </a>
    </div>
    <div className="text-center mt-5">
      { edit ? <button type="submit" className="px-5 py-2 btn btn-dark text-white" onClick={handleSave}>Save</button> : <div></div>}
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
        <div className="mb-2 d-flex justify-content-between">
               <div>
                <h4>Contacts</h4>
                </div>
                
               {/* <div>
                
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
<label >Phone </label>
<input  type="number" placeholder="Enter Phone Number" className="w-full mt-2 mb-3 form-control" onChange={(e)=>setPhone(e.target.value)}/>
<label >Name</label>
<input type="text" placeholder="Enter Name" className="w-full mt-2 mb-3 form-control" onChange={(e)=>setName(e.target.value)}/>

              </div>
              
</form>
              <div className="modal-footer">
                <button className="btn btn-primary" type="submit" onClick={handleContacts}>Submit</button>
              </div>
              </div>
                        
              </div>
                </div> 
                </div> */}
             
        </div>
      
        <form className="search-form d-flex align-items-center" onSubmit={handleSearch}>
            <input type="text" className={`${theme==='dark' ? 'background-light' : 'background-dark'} w-full  px-4 py-2`} placeholder="Search here..." onChange={(e)=>setSearch(e.target.value)}/>        
          <a type="submit" className=" text-muted"> <BiSearch fontSize={24}/></a>
           </form>
        </div>
        <div className="sidebar-body">
           <div className="users">           
           {
              filteredUsers.filter((user)=>user.username!==adminn.username)
              .map((user)=>{
             
return (        
<div className={theme==='dark' ? 'user-profile border-secondary bs-light' : 'user-profile border-red bs-dark'}  onClick={()=> setSelectedUser(user)}  key={user._id}>
            <div className="user position-relative d-flex justify-between" >
                 
              <div className="notifies d-flex pl-3 ">                     
           <a className="position-relative">
            <img className="avatar" src='user-profile.png'  alt="user" ></img>
            {/* <span className="status"></span> */}
            </a>
              
                <div className="d-flex flex-column justify-center">
                <h5 className="text-truncate text-capitalize">{user.username}</h5>   
    
        </div>      
                </div>  
                <ul>
                 
                <li className="dropdown">
                <button className={theme==='dark' ? 'text-white' :'text-dark'} role="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" >< BsThreeDotsVertical  fontSize={24} /></button>
                <ul className={`${className} dropdown-menu`} aria-labelledby="dropdownMenuButton" >
                {/* <li className="dropdown-item"><a  href="#" className="text-muted">Contact info <span><MdOutlineInfo fontSize={28}/></span></a></li> */}
                <li className="dropdown-item" >
                  { 
                  blocked===true ? <a className="d-flex justify-content-between">Unblock user <span><CgUnblock fontSize={24} onClick={handleUnblock}/></span></a>
                    :     <a className="d-flex justify-content-between">Block user <span><BiBlock fontSize={24} onClick={handleBlock}/></span></a>
              }</li>
                <li className="dropdown-item"><a className="d-flex justify-content-between">Delete user <span><BsTrash fontSize={24} onClick={deleteUser}/></span></a></li>
                
                </ul>
                </li>
                </ul> 
            
             
            </div>
       </div>
)


   })
  }
   </div>
   
       
           </div>
        </div>
        
        </div>
        </>
    )
}
export default Chats;
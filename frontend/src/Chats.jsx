import { PiPhoneCall } from "react-icons/pi";
import { RiContactsLine } from "react-icons/ri";
import { CiSquarePlus } from "react-icons/ci";
import { BiSearch } from "react-icons/bi";
import { FaPenSquare, FaRegEdit } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { useState,useEffect, useContext } from "react";
import { ThemeContext } from "./ThemeContext";
import { ApiContext } from "./ApiContext";
import { socket } from "./Socket";
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
const [edit,setEdit]=useState(true)



const userInfo = JSON.parse(localStorage.getItem('userInfo'))
let adminn=''
if(userInfo){
adminn =userInfo.data
                    }
const user=userInfo?.data
const token=userInfo?.data?.token
const [username,setUsername]=useState(user.username)


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

const handleContacts=(e)=>{
e.preventDefault()
}

const handleUser=()=>{

if(selectedUser){
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
    "Content-Type":"application/json",
    "Authorization":`Bearer ${token}`
    }
})
}
catch(err){
    console.log(err)
}
}
reader.readAsDataURL(file)
}
const handleProfile=async(e)=>{
e.preventDefault()

if(!edit){
try{
await axios.put(`${apiUrl}/profile/${userId}`, {username,password},{
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
            <input type="text" className="w-full rounded-full px-2 py-2" placeholder="  Search here..." onChange={(e)=>setSearch(e.target.value)}/>        
          <a type="submit" className=" text-muted"> <BiSearch fontSize={24}/></a>
           </form>
            </div>     
           <div className="sidebar-body">
           <div className="users">           
           {
              filteredUsers.map((user)=>{
            
return (        
<a className="user-profile" onClick={()=> setSelectedUser(user)}  key={user._id}>
            <div className="user position-relative d-flex" onClick={handleUser}>
      
            {user.username===adminn ? <img src={`http://localhost:5000${adminn.image}`} className="admin-img"/> :    <img className="avatar" src='user-profile.png' ></img>}
              
          <span className="status">ff</span>
       
          
              <div className="notifies d-flex flex-column pl-3 justify-content-between">
    <h5 className="text-truncate">{user.username}</h5> 

                </div>     
        
    
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


        <div className="user-profile">
          {
            adminn ?
            <>
             <div className="profile-img d-flex justify-content-center">
<img src={image} className="rounded-circle avatar"/>
</div>
<h5 className="text-center pb-3">{adminn.username}</h5> 
            </> 
            : <></>
          }
   
{/* <p className="text-center text-muted">{admin.about}</p> */}


</div> 
<div className="user-content">
    <p id="about" className="text-muted"> {about}</p> 
<div className="media mt-4">
  <div className=" d-flex justify-content-between mb-3">
<h5>Media </h5>
<a>Show all</a>
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
</div>
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


        <div className="user-profile">
        <form onSubmit={handleProfile} id="prof">
          {
         
            adminn ? (
            
            <>
             <div className="profile-img d-flex justify-content-center">
              <figure className="position-relative">

       
<img src={image} className="rounded-circle avatar"></img>
  <label>  <input type="file" accept="image" name="image" onChange={handleImage}/>
  <a>
    <MdOutlineEdit fontSize={28} />
    </a>
  </label>
  </figure>
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

<div className="user-content">
    <label className="text-muted pb-2">About</label>
    <textarea className="w-full" id="about" value={about} rows={4}  cols={7} onChange={(e)=>setAbout(e.target.value)} /> 
    <label className="text-muted pb-2">Name</label>
    <input className="w-full"   value={username}   onChange={(e)=>setUsername(e.target.value)}/>
    <label className="text-muted  pt-3 pb-2">Password</label>
    <input className="w-full font-size-14" type="password" value={password}  onChange={(e)=>setPassword(e.target.value)}/>
    <div className="text-center mt-3">
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
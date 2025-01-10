import { BsChatSquareText,BsThreeDots, BsThreeDotsVertical} from "react-icons/bs";
import {PiChats} from "react-icons/pi";
import { CgProfile } from "react-icons/cg";
import { CiCamera, CiDark, CiLight, CiLogout, CiSettings } from "react-icons/ci";
import { FiLogOut } from "react-icons/fi";
import { PiPhoneCall } from "react-icons/pi";
import { RiContactsLine } from "react-icons/ri";
import { CiSquarePlus } from "react-icons/ci";
import { BiSearch } from "react-icons/bi";
import { useState,useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client"
import { ThemeContext } from "./ThemeContext";
import axios from "axios";
import { socket } from "./Socket";
// import { FontAwesomeIcon } from '@fortawesome/fontawesome-free'
import { FaPenSquare, FaRegEdit } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
const userInfo = JSON.parse(localStorage.getItem('userInfo'))
let adminn=''
if(userInfo){
 adminn =userInfo.data
}


const Sidebar=({messages,setMessages, handleThemes,attach,selectedUser,setSelectedUser, onlineUser })=>{
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
 const user=userInfo?.data
 const token=userInfo?.data?.token
 const [username,setUsername]=useState(user.username)
    const navigate=useNavigate()
    useEffect(()=>{
      fetch('https://chat-app-64fc.onrender.com/api/')
      .then((res)=>res.json())
      .then((data)=>{
        setUsers(data)
        setFilteredUsers(data)
      })
      },[])
  
    useEffect(()=>{  
        if (!selectedUser) return;
            const fetching=async()=>{           
                const response=await fetch(`https://chat-app-64fc.onrender.com/api/messages/${selectedUser._id}`, {
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
            

    const handleLogout=()=>{
       localStorage.removeItem("userInfo")
        navigate("/login")
         socket.disconnect()
        }
   

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


const handleImage = (e)=>{
  const file=e.target.files[0]

  const reader= new FileReader()
  reader.onloadend=()=>{
    // const updatedUser={...adminn,image:reader.result}
    // localStorage.setItem("userInfo", JSON.stringify({data:updatedUser}))
    setImage(reader.result)

   try{
   axios.put(`https://chat-app-64fc.onrender.com/api/profile/${userId}`, {image},{
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
    await axios.put(`https://chat-app-64fc.onrender.com/api/profile/${userId}`, {username,password},{
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

// const admin=users.find(item=>item.role==='Admin')
const userId=adminn ? adminn._id : null

 
    return (
        <>
        <div className="sidebar" style={{backgroundColor: '#36404a'  }}    >
        <div className="logo pt-4"><a > <BsChatSquareText fontSize={34}/></a></div>
  <div className="navbar-menu pt-5">
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
        <div className="col-md-3 chats tab-content overflow-auto" id="nav-tabContent"  style={{backgroundColor: theme==='dark' ? '#303841': "#f5f7fb"  }}>
        <div className="sidebar-left tab-pane fade show active" id="chat" role="tabpanel" aria-labelledby="chat-tab">
            <div className="header">
                <div className="mb-4">
                <h4>Chat</h4>
                </div>          
            <form className="search-form d-flex align-items-center" onSubmit={handleSearch}>
            <input type="text" className="form-control bg-light" placeholder="Search here..." onChange={(e)=>setSearch(e.target.value)}/>        
          <a type="submit" className=" text-muted"> <BiSearch fontSize={24}/></a>
           </form>
            </div>     
           <div className="sidebar-body">
           <div className="users">           
           {
              filteredUsers.map((user)=>{
            
return (        
<a className="user-profile" onClick={()=> setSelectedUser(user)}  key={user._id}>
            <div className="user position-relative d-flex pb-3" >
      
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
                <div className="mb-4 d-flex justify-content-between">
               <div>
                <h4>My Profile</h4>
                </div>
                </div>
           
                </div>


        <div className="user-profile">
          {
            adminn ?
            <>
             <div className="profile-img d-flex justify-content-center mb-3">
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
    {/* <div className="mt-3 d-flex gap-3 text-end">
      <button className="btn btn-primary" type="submit" onClick={handleEdit}>Edit</button> 
      <button className="btn btn-success" type="submit" onClick={handleSave}>Save</button>
   
      </div>  */}
<div className="media mt-4">
  <div className=" d-flex justify-content-between mb-3">
<h5>Media </h5>
<a className="text-success">Show all</a>
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
                <div className="mb-4 d-flex justify-content-between">
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
              <figure>

       
<img src={image} className="rounded-circle avatar"></img>
  <label>  <input type="file" accept="image" name="image" onChange={handleImage}/>
  <a>
    <MdOutlineEdit fontSize={28} />
    </a>
  </label>
  </figure>
</div>
<div className="text-center">


<h5 className="pb-3">{adminn.username}</h5> 
{/* <div className="dropdown pb-4">
<a className="text-muted dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Available</a>
<ul className="dropdown-menu">
<li><a className="dropdown-item"> Busy</a></li>
<li><a className="dropdown-item"> Sleeping</a></li>
<li><a className="dropdown-item"> Don't disturb</a></li>
</ul>
</div> */}
</div>
<div className="user-content">
    <label className="text-muted pt-3 pb-3">About</label>
    <textarea className="form-control" id="about" value={about} rows={4}  cols={7} onChange={(e)=>setAbout(e.target.value)} /> 
    <label className="text-muted pt-3 pb-2">Name</label>
    <input className="form-control"      value={username}   onChange={(e)=>setUsername(e.target.value)}/>
    <label className="text-muted  pt-3 pb-2">Password</label>
    <input className="form-control font-size-14" type="password" value={password}  onChange={(e)=>setPassword(e.target.value)}/>
    <div className="text-center mt-3">
      {
        edit ?  (<button className="btn btn-primary" onClick={()=>setEdit(false)}>Edit</button> ) : 
        (  <button type="submit" className="btn btn-success">Save</button>)

      }
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
<input type="text" placeholder="Enter Email" className="form-control" onChange={(e)=>setEmail(e.target.value)}/> */}
<label >Phone </label>
<input  type="number" placeholder="Enter Phone Number" className="form-control mt-3 mb-3" onChange={(e)=>setPhone(e.target.value)}/>
<label >Name</label>
<input type="text" placeholder="Enter Name" className="form-control mt-3 mb-3" onChange={(e)=>setName(e.target.value)}/>

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
            <input type="text" className="form-control bg-light" placeholder="Search contacts..."/>
          <a type="submit" className=" text-muted"> <BiSearch fontSize={24}/></a>
           </form>
        </div>
        </div>
        </div>
        </>
    )
}
export default Sidebar;
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
// import { FontAwesomeIcon } from '@fortawesome/fontawesome-free'
import { FaPenSquare, FaRegEdit } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
const socket=io.connect("http://localhost:5000/")

const userInfo = JSON.parse(localStorage.getItem('userInfo'))
let adminn=''
if(userInfo){
 adminn =userInfo.data.username
}


const Sidebar=({messages,setMessages, handleThemes,attach,selectedUser,setSelectedUser})=>{
    const {theme,handleTheme}=useContext(ThemeContext)
    const [users,setUsers]=useState([])
    const [name,setName]=useState('')
    const [email,setEmail]=useState('')
    const [phone,setPhone]=useState('')
    const [about,setAbout]=useState('“When you change your thoughts, remember to also change your world.” —Norman Vincent Peale')
    const [saved,setSaved]=useState(false)
    const [image,setImage]=useState(null)
    const [search,setSearch]=useState('')
    
 const userInfo = JSON.parse(localStorage.getItem('userInfo'))
 const user=userInfo?.data
 const token=userInfo?.data?.token

    const navigate=useNavigate()
    useEffect(()=>{
      fetch('http://localhost:5000/api/')
      .then((res)=>res.json())
      .then((data)=>{
        setUsers(data)})
      },[])
  
    useEffect(()=>{  
            if(!selectedUser) return;
            const fetching=async()=>{           
                const response=await fetch(`http://localhost:5000/api/messages/${selectedUser._id}`, {
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
                // return()=>{
                // socket.disconnect()
                // }
              },[selectedUser,token])
            

    const handleLogout=()=>{
       localStorage.removeItem("userInfo")
        navigate("/login")
        // socket.disconnect()
        }
   




const textarea=document.getElementById('about')


const handleAbout=(e)=>{
  textarea.focus()
  setSaved(true)

}

const handleContacts=(e)=>{
  e.preventDefault()
}

const handleImage = async (e)=>{
  
 const formData=new FormData()
 formData.append('file', image)

try{
 await axios.put(`http://localhost:5000/api/profile/${userId}`, formData,{
  headers:{
    "Content-Type":"multipart/form-data"
  }
 })
 const fileInput=document.getElementById('prof')
 fileInput.addEventListener('submit',(e)=>{
 e.preventDefault()
 })
}
catch(err){
  console.log(err)
}
}
const admin=users.find(item=>item.role==='Admin')
const userId=admin ? admin._id : null

 
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
        <div className="col-md-3 chats tab-content" id="nav-tabContent"  style={{backgroundColor: theme==='dark' ? '#303841': "#f5f7fb"  }}>
        <div className="sidebar-left tab-pane fade show active" id="chat" role="tabpanel" aria-labelledby="chat-tab">
            <div className="header">
                <div className="mb-4">
                <h4>Chat</h4>
                </div>          
            <form className="search-form d-flex align-items-center">
            <input type="text" className="form-control bg-light" placeholder="Search here..." onChange={(e)=>setSearch(e.target.value)}/>        
          <a type="submit" className=" text-muted"> <BiSearch fontSize={24}/></a>
           </form>
            </div>     
           <div className="sidebar-body">
           <div className="users">           
           {
              users.map((user)=>{
return <div>        
<a className="user-profile" onClick={()=> setSelectedUser(user)}  key={user._id}>
            <div className="user position-relative d-flex" >
      
            {user.username===adminn ? <img src={`http://localhost:5000${admin.image}`} className="admin-img"/> :    <img className="avatar" src='user-profile.png' ></img>}
              
          <span className="status"></span>
          
              <div className="notifies d-flex flex-column pl-3 justify-content-between">
             {user.username===adminn ?   <h5 className="text-truncate">You</h5> :   <h5 className="text-truncate">{user.username}</h5> }
            
  
    
             
                </div>     
        
    
            </div>
       </a>
</div>


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
            admin ?
            <>
             <div className="profile-img d-flex justify-content-center mb-3">
<img src={`http://localhost:5000${admin.image}`} className="rounded-circle avatar"/>
</div>
<h5 className="text-center pb-3">{admin.username}</h5> 
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
<div className="media-img">
  {/* {
    Usermessages.filter((item)=>item.image).map(item=>{
     
     return (
        <>
        <img src={item.image}/>
        </>
      )

    })
  } */}
  
<div>

</div>
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
          {
         
            admin ?
            
            <>
             <div className="profile-img d-flex justify-content-center mb-3">
<img src={`http://localhost:5000${admin.image}`} className="rounded-circle avatar"/>
<form onSubmit={handleImage} id='prof'>
  <label>  <input type="file"  name="image" onChange={(e)=>setImage(e.target.files[0])
  

  } /><a>
    <MdOutlineEdit fontSize={28} />
    </a>
  </label>
</form>


</div>
<div className="text-center">


<h5 className="pb-3">{admin.username}</h5> 
<div className="dropdown pb-4">
<a className="text-muted dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Available</a>
<ul className="dropdown-menu">
<li><a className="dropdown-item"> Busy</a></li>
<li><a className="dropdown-item"> Sleeping</a></li>
<li><a className="dropdown-item"> Don't disturb</a></li>
</ul>
</div>
</div>
<div className="user-content">
    <textarea className="form-control" id="about" value={about} rows={4}  cols={7} onChange={(e)=>setAbout(e.target.value)} /> 
    <label className="text-muted pt-3 pb-3">Name</label>
    <input className="form-control" defaultValue={admin.username}/>
    <label className="text-muted  pt-3 pb-3">Email</label>
    <input className="form-control font-size-14" defaultValue={admin.email}/>
</div>
            </> 
            : <></>
          }
   


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
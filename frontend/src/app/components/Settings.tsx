import { useState, useContext, useRef} from "react"
import { ApiContext } from "../ApiContext"
import { ThemeContext } from "../ThemeContext"
import { CiEdit } from "react-icons/ci";
import axios from "axios";
import  Swal from "sweetalert2";
import type { User } from "./Chats";
import Image from "next/image";
import { AuthContext } from "../AuthContext";

type Props={
  setFilteredUsers:React.Dispatch<React.SetStateAction<User[]>>
}

const Settings=({setFilteredUsers}:Props)=>{
  const {apiUrl}=useContext(ApiContext)
  const {theme}=useContext(ThemeContext)
  const {user,setUser, token}=useContext(AuthContext)
  const [edit,setEdit]=useState(false)
  const [about,setAbout]=useState(user?.about || 'change your thoughts and you change your world')
  const [image,setImage]=useState(user?.image || "user-profile.png")
  const [username,setUsername]=useState(user?.username || 'turgay')
  const userId=user ? user._id : null
  const userRef=useRef<HTMLInputElement>(null)
  const aboutRef=useRef<HTMLTextAreaElement>(null)


    const handleImage = (e:React.ChangeEvent<HTMLInputElement>)=>{
      setEdit(false)
      e.preventDefault()
    const file = e.target.files?.[0]
    if(!file) return;
    
    const reader= new FileReader()
    reader.onloadend=async()=>{
      const imageBase64=reader.result as string
      setImage(imageBase64)
    try{
    await axios.put(`${apiUrl}/profile/${userId}`, {image:imageBase64}, {
        headers:{
         Authorization:`Bearer ${token}`,
        "Content-Type":"application/json",
        }
    })
    setUser((prevUser:User | null)=>prevUser ? {...prevUser, image:imageBase64 }: null)
     window.localStorage.setItem('userInfo',JSON.stringify({...user, image:imageBase64}))
    setFilteredUsers((prevUsers)=>prevUsers.map((item)=>
     item._id===userId ? {...item, image:imageBase64} : item))
    }
    
    catch(err){
        console.log(err)
    }
    }
    reader.readAsDataURL(file)
    }

    const handleProfile=async(e:React.FormEvent)=>{
        setEdit(false)
      e.preventDefault()
      
      try{
      await axios.put(`${apiUrl}/profile/${userId}`, {username, about}, {
          headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${token}`
          }
      })
      
        window.localStorage.setItem('userInfo',JSON.stringify({data:{...user, username, about}}))
      
      }
      
      catch(err){
          console.log(err)
      }
      
      
      
      }
      const handleSave=()=>{
        Swal.fire({
          title:"Save changes",
          text:"Are you sure?",
          icon:"warning"  })
      
      }
      const handleEdit=()=>{
        setEdit(true)
        if(userRef.current){
          userRef.current.focus()
        }
        if(aboutRef.current){
          aboutRef.current.focus()
        }
      
      
      }
    return (
        <>
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
         
            user ? (           
            <>
            <div className={theme==='dark' ? 'user-profile border-secondary' : 'user-profile border-red'}>         
             <div className="profile-img d-flex justify-content-center">
 <div className="position-relative">     
<Image src="/admin.jpeg" className={`${theme==="dark" ? 'border-lighted' :'border-grey'} rounded-circle avatar`} alt="user" width={100} height={100} loading="lazy"/> 
  
  <div className="d-none">{image}</div>
  <label htmlFor="image">
     <input type="file" accept="image" name="image" onChange={handleImage} id="image"/>
  <a className={theme==='dark' ? 'btn btn_light' : "btn btn_dark"}>
    <CiEdit />
    </a>
{}
  </label>
  </div>
</div>
<h5 className="text-center">{user.username}</h5> 
</div>

{/* <div className="dropdown pb-4">
<a className="text-muted dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Available</a>
<ul className="dropdown-menu">
<li><a className="dropdown-item"> Busy</a></li>
<li><a className="dropdown-item"> Sleeping</a></li>
<li><a className="dropdown-item"> Don't disturb</a></li>
</ul>
</div> */}

<div className='user-content'>
    <label className={ theme==='light' ? 'text-muted' : 'text-mute' } htmlFor="about">About</label>

      <div className="d-flex justify-content-evenly align-items-center gap-5"> 
        <textarea className="w-full" id="about" ref={aboutRef}  value={about} rows={2}  cols={3}   disabled={edit ? false : true} onChange={(e)=>setAbout(e.target.value)} maxLength={50}/> 
        <a className={theme==='dark' ? 'btn btn_light' : "btn btn_dark"} onClick={handleEdit}>
    <CiEdit   />
    </a>    
    </div>
    <label className={theme==='light' ? 'text-muted' : 'text-mute'} htmlFor="username">Name</label>  
    <div className="d-flex justify-content-evenly align-items-center" >
         
       
         <input className="w-full" ref={userRef}  value={username}  disabled={edit ? false : true}  onChange={(e)=>setUsername(e.target.value)} id="username"/>
         
       
         <a className={theme==='dark' ? 'btn btn_light' : "btn btn_dark"} onClick={handleEdit}>
    <CiEdit   />
    </a>    
    </div>
   
    {/* <label className={theme==='light' ? 'text-muted' : 'text-mute'}>Password</label>
    <div className="d-flex justify-around align-items-center">
    <input className="w-full font-size-14 " type="password"    value={password}  onChange={(e)=>setPassword(e.target.value)} disabled={edit ? false : true} />
     <a className={theme==='dark' ? 'btn btn_light' : "btn btn_dark "}  onClick={handleEdit}>
    <CiEdit />
    </a>
    </div> */}
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
 
        </>
    )
}
export default Settings;
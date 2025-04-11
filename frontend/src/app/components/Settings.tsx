import { useState, useContext, useRef, useEffect} from "react"
import { ApiContext } from "../ApiContext"
import { ThemeContext } from "../ThemeContext"
import { CiEdit } from "react-icons/ci";
import axios from "axios";
import type { User } from "./Chats";
// import Image from "next/image";
import { AuthContext } from "../AuthContext";
;

type Props={
  setFilteredUsers:React.Dispatch<React.SetStateAction<User[]>>
}

const Settings=({setFilteredUsers}:Props)=>{
  const {apiUrl}=useContext(ApiContext)
  const {theme}=useContext(ThemeContext)
  const {user, token}=useContext(AuthContext)
  const [edit,setEdit]=useState(false)
  // const [password,setPassword]=useState(user?.password)
  // const [about,setAbout]=useState(user?.about || 'change your thoughts and you change your world')
  const [image,setImage]=useState(user?.image)
  const [username,setUsername]=useState(user?.username) 
  const userId=user ? user._id : null
  const userRef=useRef<HTMLInputElement>(null)
  const passRef=useRef<HTMLInputElement>(null)
  // const aboutRef=useRef<HTMLTextAreaElement>(null)
useEffect(()=>{
if(user){
  setUsername(user.username)
  setImage(user.image)
}
},[user])

    const handleImage = async(e:React.ChangeEvent<HTMLInputElement>)=>{
      e.preventDefault()
    const file = e.target.files?.[0]
    if(!file) return;
    const formData=new FormData()
    formData.append('image', file)

    try{
 const result  = await axios.put(`${apiUrl}/api/profile/${userId}`, formData, {
        headers:{
         Authorization:`Bearer ${token}`,
        "Content-Type":"multipart/form-data",
        }
    })

     const newImage=result.data.user.image
     setImage(newImage)
     window.localStorage.setItem('userInfo',JSON.stringify({...user, image:newImage}))
     setFilteredUsers((prevUsers)=>prevUsers.map((item)=>
     item._id===userId ? {...item, image:newImage} : item))
     setEdit(false)
    }
    
    catch(err){
        console.log(err)
    } }

    const handleProfile=async(e:React.FormEvent)=>{
      e.preventDefault()
      try{
      await axios.put(`${apiUrl}/api/profile/${userId}`, {username}, {
          headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${token}`
          }
      })      
        window.localStorage.setItem('userInfo',JSON.stringify({...user, username}))
        setFilteredUsers((prevUsers)=>prevUsers.map((item)=>
        item._id===userId ? {...item, username} : item))      
         setEdit(false)  
      }      
      catch(err){
          console.log(err)
      }
      }
      const handleEdit=(field:string)=>{
      setEdit(true)
        if(userRef.current){
          userRef.current.focus()          
        }   
        if(field==="password" && passRef.current){
         passRef.current.focus()          
        }   
      }
      const handleCancel=()=>{
        setEdit(false)
      }
      console.log(user)
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
            {  user ? (           
             <>
              <div className={theme==='dark' ? 'user-profile border-secondary' : 'user-profile border-red'}>         
                <div className="profile-img d-flex justify-content-center">
                  <div className="position-relative">     
    
                    <img src={`http://localhost:5000/${image}`} className={`${theme==="dark" ? 'border-lighted' :'border-grey'} rounded-circle avatar`} alt="user" width={100} height={100} loading="lazy" /> 
                      <label htmlFor="image">
                      <input type="file"  name="image" id="image" onChange={handleImage}/>
                      <a className={theme==='dark' ? 'btn btn_light' : "btn btn_dark"}><CiEdit /></a>
                      {}
                      </label>
                  </div>
                </div>
                {/* <h5 className="text-center">{user.username}</h5>  */}
              </div>
              <div className='user-content'>
                {/* <label className={ theme==='light' ? 'text-muted' : 'text-mute' } htmlFor="about">About</label>
                <div className="d-flex justify-content-evenly align-items-center gap-5"> 
                  <textarea className="w-full" id="about" ref={aboutRef}  value={about} rows={2}  cols={3}  onChange={(e)=>setAbout(e.target.value)} maxLength={50}/> 
                  <a className={theme==='dark' ? 'btn btn_light' : "btn btn_dark"} onClick={()=>handleEdit()}><CiEdit   /></a>    
                </div> */}
                <label className={theme==='light' ? 'text-muted' : 'text-mute'} htmlFor="username">Name</label>  
                <div className="d-flex justify-content-evenly align-items-center" >
                  <input className="w-full"  ref={userRef}  value={username}    onChange={(e)=>setUsername(e.target.value)} readOnly={edit ? false : true} id="username"/>
                 {
                  edit ?  <></> : <a className={theme==='dark' ? 'btn btn_light' : "btn btn_dark"} onClick={()=>handleEdit('')}><CiEdit   /></a>
                 }             
                </div>
                {/* <label className={theme==='light' ? 'text-muted' : 'text-mute'} htmlFor="password">Password</label>  
                <div className="d-flex justify-content-evenly align-items-center" >
                  <input className="w-full"  ref={passRef}  type="password" readOnly={edit ? false : true}  onChange={(e)=>setPassword(e.target.value)} id="password"/>
                  {
                  edit ?  <></> : <a className={theme==='dark' ? 'btn btn_light' : "btn btn_dark"} onClick={()=>handleEdit("password")}><CiEdit   /></a>
                 }  
                </div> */}
                {
                  edit ? 
                   <div className="d-flex mt-5 gap-3">
                     <button type="submit" className="px-5 py-2 btn btn-dark text-white">Update</button> 
                     <button  className="px-5 py-2 btn btn-danger text-white" onClick={handleCancel}>Cancel</button> 
                   </div>  
                  :
                   <></>
                }
              </div>
           </> ):<></>}
          </form>
        </div> 
      </div>
 
        </>
    )
}
export default Settings;
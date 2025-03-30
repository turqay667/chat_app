import { BsThreeDotsVertical, BsTrash } from "react-icons/bs";
import { CgUnblock } from "react-icons/cg";
import { useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import axios from "axios"
import { BiSearch, BiBlock } from "react-icons/bi";
import  Swal from "sweetalert2";
import Image from "next/image";
import { ApiContext } from "../ApiContext";
import type { User } from "./Chats";
import { AuthContext } from "../AuthContext";


type Props={
  selectedUser:User | null,
  handleSearch:()=>void
  setSelectedUser:(selected:User)=>void
  blocked:boolean,
  setBlocked:(blocked:boolean)=>void,
  filteredUsers:User[],
  setFilteredUsers:React.Dispatch<React.SetStateAction<User[]>>,
  setSearch:React.Dispatch<React.SetStateAction<string>>,
 
}

const Contacts=({handleSearch, filteredUsers, blocked, setBlocked, selectedUser,setSelectedUser, setSearch, setFilteredUsers}:Props)=>{
    const {apiUrl}=useContext(ApiContext)
    const {token,user}=useContext(AuthContext)
    const {theme}=useContext(ThemeContext)

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
    const handleDelete= async ()=>{

      try{
        await axios.delete(`${apiUrl}/users/${selectedUser?._id}`,
          {
          headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${token}`
          }
        })
        setFilteredUsers(prevUsers=>(prevUsers.filter((user)=>user._id!==selectedUser?._id)))
        Swal.fire('User deleted successfully')
      }
      catch(err){
        console.error(err)
      }
     
    }
    return (
        <>
        <div className="sidebar-left tab-pane fade" id="contacts" role="tabpanel" aria-labelledby="contacts-tab">
        <div className="header">
        <div className="mb-3 d-flex justify-content-between">
               <div>
                <h4>Contacts</h4>
                </div>
                
               <div>
                
                {/* <button className="btn" type="button" data-bs-toggle="modal" data-bs-target="#contactsModal" aria-label="modal"><CiSquarePlus fontSize={32}/></button> */}
              {/* <div className="modal fade" id="contactsModal" aria-labelledby="contactsModalLabel" aria-hidden="true">
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
                </div>  */}
                </div>
             
        </div>
      
        <form className="search-form d-flex align-items-center" onSubmit={handleSearch}>
            <input type="text" className={`${theme==='dark' ? 'background-light' : 'background-dark'} w-full  px-4 py-2`} placeholder="Search here..." onChange={(e)=>setSearch(e.target.value)}/>        
          <a type="submit" className="text-muted"> <BiSearch fontSize={24}/></a>
           </form>
        </div>
        <div className="sidebar-body">
           <div className="users">           
           {
              filteredUsers.filter((item)=>item.username!==user?.username).map((user)=>{             
return (        
<div className={theme==='dark' ? 'user-profile border-secondary bs-light' : 'user-profile border-red bs-dark'}  onClick={()=> setSelectedUser(user)}  key={user._id}>
            <div className="user position-relative d-flex justify-between" >
                 
              <div className="notifies d-flex pl-3 ">                     
           <a className="position-relative">
            <Image className="avatar" src={`/${user.image}`}  alt="user"  priority={true}  width={60} height={60}/>
            {/* <span className="status"></span> */}
            </a>
              
                <div className="d-flex flex-column justify-center">
                <h5 className="text-truncate text-capitalize">{user.username}</h5>   
    
        </div>      
                </div>  
                <ul>
                 
                <li className="dropdown contact-actions">
                <button className={theme==='dark' ? 'text-white' :'text-dark'} role="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" aria-label="dropdown">< BsThreeDotsVertical  fontSize={24} /></button>
                <ul className={`${theme==='dark' ? 'background-light text-white' : 'background-dark text-muted'} dropdown-menu`} aria-labelledby="dropdownMenuButton" >
                {/* <li className="dropdown-item"><a  href="#" className="text-muted">Contact info <span><MdOutlineInfo fontSize={28}/></span></a></li> */}
                <li className="dropdown-item" >
                  { 
                  blocked===true ? <a className="d-flex justify-content-between"  onClick={handleUnblock}>Unblock user <span><CgUnblock /></span></a>
                    :     <a className="d-flex justify-content-between" onClick={handleBlock}>Block user <span><BiBlock  /></span></a>
              }</li>
                <li className="dropdown-item"><a className="d-flex justify-content-between">Delete user <span><BsTrash  onClick={deleteUser}/></span></a></li>
                
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
        </>
    )
}
export default Contacts;
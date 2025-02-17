import { useContext, useState } from "react";
import { ApiContext } from "./ApiContext";
import Swal from "sweetalert2";
import axios from "axios";
import { BsTrash,BsThreeDotsVertical } from "react-icons/bs";
import { BiSolidEdit } from "react-icons/bi";
const Message = ({ messages, user, theme,setMessages}) => {
  const className=theme==='dark' ? 'background-light text-mute message-content' : 'background-dark text-muted message-content'
  const colors=theme==='dark' ? 'text-white' :'text-dark'
  const {apiUrl,token}=useContext(ApiContext)
  const [selectedMessage, setSelectedMessage]=useState()
  const handleDelete=async()=>{
    try{
      await axios.delete(`${apiUrl}/messages/message/${selectedMessage}`, {
       headers:{
         "Content-Type":"application/json",
         "Authorization":`Bearer ${token}`
       }
      })
       setMessages(prevMessages=>(prevMessages.filter((message)=>message._id!==selectedMessage)))
     }
   
     catch(err){
       console.log(err)
     }
     }
  return (
    <div className="messages">
      { messages.length>0 ? (
       messages.map((message) => {
    
  return (
    
            <div key={message._id}  className={`message ${message.sender===user._id  ? "justify-content-end" : "justify-content-start"}`} onClick={()=>setSelectedMessage(message._id)}>                
                   <ul>         
                  <li className="dropdown">
                  <button className={`${colors} `} role="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" >< BsThreeDotsVertical  fontSize={20} />
                  </button>
                  <ul className={theme==='dark' ? 'background-light text-mute dropdown-menu' : 'background-dark text-muted dropdown-menu'} aria-labelledby="dropdownMenuButton" >
                  <li className="dropdown-item"  onClick={handleDelete}>
                  <a >
                 <span><BiSolidEdit fontSize={24}/></span> Edit</a> 
                  </li>
                  <li className="dropdown-item"><a onClick={handleDelete} ><span><BsTrash fontSize={24}/></span>Delete</a></li>                 
                  </ul>
                  </li>
                  </ul>
                <div className={className}>
            
                  {message.image && <img src={message.image} alt="media" />}
                  {message.audio && <audio src={message.audio}  preload="metadata"  controls  id="records">
                    </audio>
                    }
                     <div className="d-flex gap-4">                   
                  <div className={colors}>{message.message}</div>                            
               </div>
                  <p className='d-flex justify-content-end'> {new Date(message.createdAt).toLocaleTimeString([], {
                    hour:"2-digit",
                    minute:"2-digit"
                  })}</p>
                      
                    
                </div>
             
            
                
              </div> 
      ) 
       
  })
):
 <>
</>
}
    </div>
    
  );
};
export default Message;

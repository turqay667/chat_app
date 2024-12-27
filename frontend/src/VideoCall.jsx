import { useState } from "react";
import { FaMicrophone,FaMicrophoneSlash,FaVideo,FaVideoSlash } from "react-icons/fa";
import { MdCallEnd } from "react-icons/md";
const VideoCall=()=>{
    const [muteSound,setMuteSound]=useState(false)
    const [muteVideo,setMuteVideo]=useState(false)

    return(
        <div className="popup">
            <div className="popup-box">   
        <figure className="avatar">
        <img src="admin.jpeg"></img>
        </figure>
       
      <h4 className="text-muted">Turgay Mammadov <span className="text-success">calling...</span></h4>
 
      <div className="d-flex gap-3 actions mt-4">
      <a className="btn btn-primary text-white rounded-circle" onClick={(e)=>setMuteSound(!muteSound)} >
      {
          muteSound ?  <FaMicrophoneSlash  /> :   <FaMicrophone />
        }
      
        </a>
      <a className="btn btn-info text-white rounded-circle" onClick={(e)=>setMuteVideo(!muteVideo)}>
        {
          muteVideo ?  <FaVideoSlash   /> :      <FaVideo  />
        }
        </a>
     <a className="btn btn-danger text-white rounded-circle"><MdCallEnd/></a>
     </div>
     </div>
      </div>
    )
}
export default VideoCall;
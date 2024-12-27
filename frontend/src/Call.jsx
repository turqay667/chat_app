import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { useState } from "react";
import {MdCallEnd} from "react-icons/md"
const Call=()=>{
    const [muteSound,setMuteSound]=useState(false)
    const [called,setCalled]=useState(true)
    const handleCall=()=>{ 
       setCalled(false)
    }
    return (
        <>
        
    {
        called ? <>
        
        <div className="popup" id="callbox">
                        <div className="popup-box">
        <figure className="avatar">
        <img src="admin.jpeg"></img>
        </figure>
      <h4 className="text-muted">Turgay Mammadov <span className="text-success">calling...</span></h4>
     <div className="d-flex gap-3 actions mt-4">
     <a className="btn btn-primary text-white rounded-circle" onClick={(e)=>setMuteSound(!muteSound)} >
        {
            muteSound ? <FaMicrophoneSlash /> : <FaMicrophone />
        }
    
        </a>
     <a className="btn btn-danger text-white rounded-circle" onClick={handleCall}><MdCallEnd /></a>
     </div>
     </div>
      </div> 
        </>
        :
        <>
        <div style={{opacity:1}}></div>
        </>
    }
    

      </>
    )
}
export default Call;
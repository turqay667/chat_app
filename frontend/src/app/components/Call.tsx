import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { useState } from "react";
import {MdCallEnd} from "react-icons/md"
import Image from "next/image";
const Call=()=>{
    const [muteSound,setMuteSound]=useState<boolean>(false)
    const [called,setCalled]=useState<boolean>(true)
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
          <Image src="admin.jpeg" alt="admin"/>
        </figure>
      <h4 className="text-muted">Turgay Mammadov <span className="text-success">calling...</span></h4>
     <div className="d-flex gap-3 actions mt-4">
     <a className="btn btn-primary text-white rounded-circle" onClick={()=>setMuteSound(!muteSound)} >
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
        <div> 
        </div>
        </>
    }
    

      </>
    )
}
export default Call;
const Message = ({ messages, user}) => {

  return (
    <div className="messages">
      { messages.length>0 ? (
       messages.map((message) => {
     
  return (
    
            <div key={message._id}  className={`message ${message.sender===user._id  ? "justify-content-end" : "justify-content-start"}`}>
                 
              
                <div>
                  {message.image && <img src={message.image} alt="media" />}
                  {message.audio && <audio src={message.audio}  preload="metadata"  controls  id="records">
                    </audio>
                    }
                  <p>{message.message}</p>
                  <p className="d-flex justify-end"> {new Date(message.createdAt).toLocaleTimeString([], {
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

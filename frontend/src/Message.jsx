const Message = ({ messages, user, theme}) => {
  const className=theme==='dark' ? 'background-light text-mute' : 'background-dark text-muted'
  const colors=theme==='dark' ? 'text-white' :'text-dark'
  return (
    <div className="messages">
      { messages.length>0 ? (
       messages.map((message) => {
     
  return (
    
            <div key={message._id}  className={`message ${message.sender===user._id  ? "justify-content-end" : "justify-content-start"}`}>                
                <div className={className}>
                  {message.image && <img src={message.image} alt="media" />}
                  {message.audio && <audio src={message.audio}  preload="metadata"  controls  id="records">
                    </audio>
                    }
                  <p className={colors}>{message.message}</p>
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

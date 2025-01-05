const Message = ({ messages, user}) => {

  return (
    <div className="messages">
      { messages.length>0 ? (
       messages.map((message) => {
  return (
            <div key={message._id}  className={`message ${message.sender===user._id  ? "justify-content-end" : "justify-content-start"}`}>
                <div >
                  {message.image && <img src={message.image} alt="media" />}

                  <p>{message.message}</p>
                  <p>{new Date(message.createdAt).toLocaleTimeString([], {
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

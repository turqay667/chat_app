const Message = ({ messages, user, currentTime }) => {
  return (
    <div className="messages">
       <div >
      { messages.length>0 ? messages.map((message,index) => {
        return (
            <div key={message._id} className={`message ${index%2 === 0  ? "flex-start" : "flex-end"}`}>
                <div>
                  {message.image && <img src={message.image} alt="media" />}

                  <p>{message.message}</p>
                  <p>{currentTime}</p>

                  {/* {imageUrl && <img src={message.message}></img>} */}
                </div>
              </div> 
        );
      }) : <></>
    }  
    </div>
    </div>
    
  );
};
export default Message;

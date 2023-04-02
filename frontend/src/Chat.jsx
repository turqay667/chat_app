import {PrettyChatWindow} from "react-chat-engine-pretty"
import { MultiChatSocket,MultiChatWindow,useMultiChatLogic } from "react-chat-engine-advanced";
const Chat=(props)=>{
    return (
        <div className="chat-body" style={{height:'100vh'}}>
           
            <PrettyChatWindow 
            projectId='53ff04f6-5fcc-414f-b5fc-4f841e7a1b20'
            username={props.user.username}
            secret={props.user.secret}
            style={{height:'100%'}}
            
            />
        </div>
    )
}
export default Chat;
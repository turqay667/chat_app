const express=require('express')
const cors=require('cors')
const dotenv=require('dotenv');
const connectDatabase = require('./config/connect');
const userRouter=require('./routes/UserRoute');
const app=express();
const socket=require('socket.io')
const WebSocket=require("ws")
const http=require("http")
const server=http.createServer(app)
const multer=require("multer")



dotenv.config()
connectDatabase({
    useNewUrlParser:true,
    useUnifiedTopology:true
})


app.use(express.json());
app.use(cors({credentials:true,origin:'http://localhost:5173'}));
app.use('/api',userRouter)
app.use('/uploads',express.static('uploads'))


const PORT=process.env.PORT || 1000;







const io=socket(server, {
  cors:{
  origin:'http://localhost:5173'
  }
})

io.on("connection", function(socket){

    socket.on("message", (data)=>{
        io.emit("message", data)
        console.log(data +" has sent")
        })

// socket.on("logged",(msg)=>{
//     console.log('username '+ msg+ ' has logged in')
// })
// socket.on('typing', (data)=>{
// console.log("user is typing " + data)
// })
let users=[]
socket.on("join", (data)=>{
    users.push(data)
    console.log(data+' joined chat')
})


socket.on("disconnect", ()=>{
    console.log("user has disconnected")
})

})

app.get('/',(req,res)=>{
    res.send('API is running on this port')
    })

server.listen(PORT,()=>
    console.log(`server is listening on port ${PORT}`))
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
const multer=require("multer");
const path = require('path');



dotenv.config()
connectDatabase({
    useNewUrlParser:true,
    useUnifiedTopology:true
})


app.use(express.json({limit:'10mb'}));
app.use(cors({
    credentials:true,
    origin:['http://localhost:3000', 'https://chat-app-bxnf.vercel.app']
    

}));
app.use('/api',userRouter)
app.use('/uploads',express.static('uploads'))


const PORT=process.env.PORT || 1000;

const io=socket(server, {
  cors:{
  origin:['http://localhost:3000', 'https://chat-app-bxnf.vercel.app'],
  methods:["GET", "POST"],
  credentials:true
  }
})
let users=[]
io.on("connection", function(socket){
    socket.on("message", (data)=>{
        io.emit("message", data)
        console.log(data +" has sent")
        })


socket.on('connect', (username)=>{
    console.log(username+ 'has connected')
})
socket.on("logged",(msg)=>{
    console.log(msg+ 'is online')
})
// socket.on('typing', (data)=>{
// console.log("user is typing " + data)
// })

socket.on("join", (username)=>{
    if(!users.some((user)=>user.username===username)){
        users.push({username,socketId:socket.id })
        console.log(users)
    }
    io.emit('online', users)
})



socket.on("disconnect", ()=>{
    users=users.filter(user=>user.socketId!==socket.id)
    console.log('User has disconnected')
})

})

app.get('/',(req,res)=>{
    res.send('API is running on this port')
    })
    if(process.env.Node_ENV==='production'){
    const buildPath=path.resolve(__dirname,'..', 'frontend', 'build')
    
    app.get('*', (req,res)=>{
        res.sendFile(path.resolve(buildPath), 'index.html')
    })
    }
server.listen(PORT, '0.0.0.0', ()=>
    console.log(`server is listening on port ${PORT}`))
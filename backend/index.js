const express=require('express')
const cors=require('cors')
const axios=require('axios')
const app=express();

app.use(express.json());
app.use(cors({origin:true}));

app.post("/authenticate", async (req,res)=>{
    const {username}=req.body;
    try{
const result = await axios.put('https://api.chatengine.io/users/',
    {username: username,secret: username,first_name:username},
    {headers: {"private-key":"6bb85512-fd93-4f31-b3a6-1db0ee50930b"}
    
})
return res.status(result.status).json(result.data)
    }
    catch(e){
return res.status(e.response.status).json(e.redata)
    }
})
app.listen(3001,()=>{
    console.log('server is listening on port 3001')
})
   
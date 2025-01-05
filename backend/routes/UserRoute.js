const express=require('express')
const User = require('../models/User')
const generateToken = require('../utils/generateToken')
const userRouter=express.Router()
const asyncHandler=require('express-async-handler')
const Message = require('../models/Messages')
const protect=require('../middleware/authMiddleware')
const mongoose=require('mongoose')
const multer = require('multer')
const bcrypt=require('bcryptjs')
// const imgconfig=multer.diskStorage({
//     destination:(req,file,callback)=>{
//         callback(null,'uploads')
//     },
//     filename:(req,file,callback)=>{
//         const uniqueSuffix=Date.now()+'-'+Math.round(Math.random()*1E9)
//         callback(null,file.fieldname+'-'+uniqueSuffix)
//     }
// })
const upload=multer({
    storage:multer.memoryStorage(),

})
userRouter.post(
    '/login',  
    asyncHandler (async(req,res)=>{
    const {username,password}=req.body
    const user= await User.findOne({username})
if(user && (await bcrypt.compare(password, user?.password || ""))){
            res.json({
                _id:user._id,
                 username:user.username,
                 role:user.role,
                 token:generateToken(user._id),
                 createdAt:user.createdAt,
              
            })
        }
        else{
                res.status(401)
                throw new Error("Invalid user data")
            }
        }))

               
        userRouter.post('/messages/:id', protect, upload.single('image'), asyncHandler(async (req,res)=>{
            try{
                // const userId=req.params.userId
                const {message, image}=req.body   
                //  const image=req.file ? req.file.path : null
                const sender=req.user._id
                const receiver=req.params.id
                const newMessage=new Message({
                    message,
                    receiver,
                    sender,
                    image,
                })

                await newMessage.save()
                res.status(201).json(newMessage)
            }
            catch(err){
                res.status(400).json({error:'Unable to send a message', details:err.message})
                throw new Error('Unable to send a message')
            }
            }))


            userRouter.put('/profile/:id', protect, asyncHandler (async (req,res)=>{
                try{      
                 const  {username,password, about, image}=req.body     
                 const user=await User.findById(req.params.id) 
                 if(username){
                    user.username=username
                 }
                     if(password){
                        user.password=password
                 }
                   if(about){
                    user.about=about
                   }
                   if(image){
                    user.image=image
                   }

                 await user.save()
                 res.status(200).json({success:true, user})
                }
                catch(err){
                 res.status(400)
                 throw new Error('Unable to change user profile')
                }
             }))
            
// userRouter.put('/profile/:id', protect, upload.single('image'), asyncHandler (async (req,res)=>{
//                 try{      
//                  const user=await User.findById(req.params.id)  
//                  user.image=req.file.buffer.toString('base64')
//                  console.log(user.image)
//                  await user.save()
//                  res.status(200).json({success:true, user})
//                 }
//                 catch(err){
//                  res.status(400)
//                  throw new Error('Unable to change a photo')
//                 }
//              }))
            
userRouter.post('/auth',asyncHandler(async (req,res)=>{
const {username,email,password}=req.body
const userExist= await User.findOne({username,email})
if(userExist){
    res.status(404)
    throw new Error('user already exists')
}
    const user = await User.create({
        username,
        email,
        password,
    })
    if(user){
    res.status(201).json({
        _id:user._id,
        username:user.username,
        email:user.email,
        password:user.password,
        role:user.role,
        token:generateToken(user._id)

    })
}

else{
    res.status(401)
    throw new Error('Invalid user data')
}
}))



userRouter.get('/messages/:id', protect, async (req,res)=>{
    if (!req.user) {
        return res.status(400).json({ message: 'User not authenticated' });
    }
    const messages=await Message.find({
    $or:[
        {sender:req.user._id,receiver:req.params.id},
        {sender:req.params.id,receiver:req.user._id}
    ] 
     
    })
    res.json(messages)
})

userRouter.delete('/messages/:id', protect, async (req,res)=>{
    if (!req.user) {
        return res.status(400).json({ message: 'User not authenticated' });
    }
    const messages=await Message.deleteMany({
    $or:[
        {sender:req.user._id,receiver:req.params.id},
        {sender:req.params.id,receiver:req.user._id}
    ] 
   
    })
    if(messages){
         res.status(200).json({success:true, message:'jj'})
    }
    else{
        res.json({message:"Messages are deleted"})
    }

})



userRouter.get('/',async (req,res)=>{
    const users=await User.find({})
  
    res.json(users)
})


module.exports=userRouter;
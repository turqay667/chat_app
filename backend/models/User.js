const moongose=require('mongoose')
const bcrypt=require('bcryptjs')
const userSchema=moongose.Schema(

    {
        username:{
            type:String,
            unique:true,
            maxlength:15,
        },
        email:{
            type:String,
            required:false,
        },
        password:{
         type:String,
         minlength:8,
         required:true,
        },  
        about:{
            type:String,
            maxlength:30,
            default:'You',
            requried:false,
        },
        image:{
            type:String,
             default:'user.profile.png',
            required:false,
        },
        role:{
        type:String,
        default:'Basic',
        required:true,
        }    ,
        isBlocked:{
            type:Boolean,
            default:false
        }

    },
    {timestamps:true}
)
userSchema.methods.matchPassword= async function(enterPassword){
return await bcrypt.compare(enterPassword,this.password)
}
userSchema.pre('save',async function(next){
   if(!this.isModified('password')){
    next()
   }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
})

const User=moongose.model("User",userSchema)
module.exports=User;
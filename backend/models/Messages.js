const { default: mongoose } = require("mongoose");
mongoose.set('strictQuery', false)
const chatSchema=mongoose.Schema(
    {
     message:{
        type:String,
        required:false,
     },
   image: {
   type:String,
   required:false,
 },
     sender:{
      type:mongoose.Schema.Types.ObjectId,
      required:true,
      ref:'User'
     },
     receiver:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
     },
  
     groupId:{
        type:Number,
        required:false,
     },
     isRead:{
        type:Boolean,
        required:false,
     },
    },
     {
        timestamps:true
     }
)
chatSchema.pre("save", async function(next){
})
const Message=mongoose.model("Message",chatSchema)
module.exports=Message;
const jwt=require('jsonwebtoken')
const generatedToken=(id)=>{
  return  jwt.sign({id},process.env.SECRET_CODE, {
    expiresIn:"30d",
})}
module.exports=generatedToken
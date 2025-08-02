import { userModel } from "../models/authModel.js"

export const getUserData=async(req,res)=>{
    const {userId}=req.body
    if(!userId){
        return res.json({success:false,message:"token not found"})
    }
    try {
        const user=await userModel.findById(userId)
        if(!user){
            return res.json({success:false,message:"user is not found"})
        }
        return res.json({success:true,userData:{
            name:user.name,
            isAccountVerified:user.isAccountVerified
        }})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}
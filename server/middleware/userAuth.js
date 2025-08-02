import jwt from "jsonwebtoken"

export const userAuth=async(req,res,next)=>{
    const {token}=req.cookies
        
    if(!token){
        return res.json({success:false,message:"User not found, login again"})
    }
    try {
        const tokenDecode=jwt.verify(token,process.env.JWT_SECRET)
        
        if(!req.body){
            req.body={}
        }
        req.body.userId=tokenDecode.id

        next()
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}
import { userModel } from "../models/authModel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import transpoter from "../config/nodemailer.js"


export const register=async(req,res)=>{
    const {email,name,password}=req.body
    if(!email || !name ||!password){
        return res.json({success:false,message:"missing fields"})
    }
    try {
        const existingUser=await userModel.findOne({email})
        if(existingUser){
            return res.json({success:false,message:"user is available please login"})
        }
        const hashedpassword=await bcrypt.hash(password,10)
        const user=new userModel({name,email,password:hashedpassword})
        await user.save()
        const token= jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"})
        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite:process.env.NODE_ENV==='production'?"none":"strict",
            maxAge:7*24*60*60*1000
        })
        const mailOption={
            from:process.env.SENDER_MAIL,
            to:email,
            subject:"Welcome to Auth App",
            text:"Thank you for Registation for Auth-App"
        }
        await transpoter.sendMail(mailOption)
        return res.json({success:true,message:"Register successfully"})

    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

export const login =async(req,res)=>{
    const {email,password}=req.body
    if(!email || !password){
        return res.json({success:false,message:"email and password required"})
    }
    try {
        const user=await userModel.findOne({email})
        if(!user){
            return res.json({success:false,message:"user is not found,register with this email"})
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.json({success:false,message:"invalid password"})
        }
        const token=jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:"7d"})
        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite:process.env.NODE_ENV==="production"?"none":"strict",
            maxAge:7*24*60*60*1000
        })
        return res.json({success:true,message:"login successfully"})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

export const logout=async (req,res)=>{
    try {
        res.clearCookie("token")
        return res.json({success:true,message:"successfully logout"})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

export const sendVerifyOtp=async (req,res)=>{
    const {userId}=req.body
    if(!userId){
        return res.json({success:false,message:"user not found"})
    }
    try {
        const user=await userModel.findById(userId)
        if(!user){
            return res.json({success:false,message:"user not found"})
        }
        const otp=String(Math.floor(100000+Math.random()*900000))
        user.verifyOtp=otp
        user.verifyOtpExpiredAt=Date.now()+24*60*60*1000
        await user.save()
        const mailOption={
            from:process.env.SENDER_MAIL,
            to:user.email,
            subject:"Account Verification Otp",
            text:`${otp} is your verifaction otp to verify your account`
        }
        await transpoter.sendMail(mailOption)
        return res.json({success:true,message:"verification otp sent successfully"})

    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

export const verifyEmail=async (req,res)=>{
    const {userId,otp}=req.body
    if(!userId ||!otp){
        return res.json({success:false,message:"missing field"})
    }
    try {
        const user=await userModel.findById(userId)
        if(!user){
            return res.json({success:false,message:"user not found"})
        }
        if(user.verifyOtp==="" || user.verifyOtp!==otp){
            return res.json({success:false,message:"invalid otp"})
        }
        if(user.verifyOtpExpiredAt<Date.now()){
            return res.json({success:false,message:"otp is expired"})
        }
        user.isAccountVerified=true,
        user.verifyOtp=""
        user.verifyOtpExpiredAt=0
        await user.save()
        return res.json({success:true,message:"account verified successfully"})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

export const isAuth=async(req,res)=>{
    try {
        return res.json({success:true,message:"authenticated successfully"})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

export const sendResetOtp=async(req,res)=>{
    const {email}=req.body
    if(!email){
        return res.json({success:false,message:"email is required"})
    }
    try {
        const user=await userModel.findOne({email})
        if(!user){
            return res.json({success:false,message:"email not found,register again"})
        }
        const otp=String(Math.floor(100000+Math.random()*900000))
        user.resetOtp=otp
        user.resetOtpExpiredAt=Date.now()+15*60*1000
        await user.save()
        const mailOption={
            from:process.env.SENDER_MAIL,
            to:email,
            subject:"Reset Password Otp",
            text:`${otp} is your 6-digit code to reset your password, proceed with it.`
        }
        await transpoter.sendMail(mailOption)
        return res.json({success:true,message:"reset password otp sent successfully"})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

export const resetPassword=async(req,res)=>{
    const {email,otp,newPassword}=req.body
    if(!email ||!otp ||!newPassword){
        return res.json({success:false,message:"email,otp and password is required"})
    }
    try {
        const user=await userModel.findOne({email})
        if(!user){
            return res.json({success:false,message:"user not found"})
        }
        if(user.resetOtp===""||user.resetOtp!==otp){
            return res.json({success:false,message:"invalid otp"})
        }
        if(user.resetOtpExpiredAt<Date.now()){
            return res.json({success:false,message:"otp expired"})
        }
        const hashedpassword=await bcrypt.hash(newPassword,10)
        user.password=hashedpassword
        user.resetOtp=""
        user.resetOtpExpiredAt=0
        await user.save()
        return res.json({success:true,message:"password has been changed"})

    } catch (error) {
        console.log(error);
        
        res.json({success:false,message:error.message})
    }
}


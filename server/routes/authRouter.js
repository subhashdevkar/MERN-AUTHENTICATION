import express from "express"
import { isAuth, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from "../controller/authController.js"
import { userAuth } from "../middleware/userAuth.js"

const authRoute=express.Router()

authRoute.post("/register",register)
authRoute.post("/login",login)
authRoute.post("/logout",logout)
authRoute.post("/is-auth",userAuth,isAuth)
authRoute.post("/send-verify-otp",userAuth,sendVerifyOtp)
authRoute.post("/verify-account",userAuth,verifyEmail)
authRoute.post("/send-reset-otp",sendResetOtp)
authRoute.post("/reset-password",resetPassword)

export default authRoute
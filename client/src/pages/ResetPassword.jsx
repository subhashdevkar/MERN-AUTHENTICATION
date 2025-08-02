import React, { use, useContext, useRef, useState } from 'react'
import assets from '../assets/assets'
import { LuLock, LuMail } from "react-icons/lu";
import axios from 'axios';
import toast from 'react-hot-toast';
import AppContext from "../context/appContext"
import { useNavigate } from 'react-router-dom';


const ResetPassword = () => {
  const [email, setEmail] = useState("")
  const [otp,setOtp]=useState("")
  const [newPassword,setNewPassword]=useState("")
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false)
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)
  const navigate=useNavigate()
  const inputRefs = useRef([])
  const { backendUrl,setState } = useContext(AppContext)
  axios.defaults.withCredentials = true

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    const otpString = e.clipboardData.getData("text")
    const otpArray = otpString.split("")
    otpArray.map((item, index) => {
      inputRefs.current[index].value = item
    })
  }
  const handleEmailSubmition = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(backendUrl + "/api/auth/send-reset-otp", { email })
      if (data.success) {
        setIsEmailSubmitted(true)
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleOtpSubmition=(e)=>{
    e.preventDefault()
    const otpArray=inputRefs.current.map((item,index)=>{
      return item.value
    })
    const otpString=otpArray.join("")
    setOtp(otpString)
    setIsOtpSubmitted(true)
  }

  const handleNewPasswordSubmittion=async(e)=>{
    e.preventDefault()
     try {
      const {data}=await axios.post(backendUrl+"/api/auth/reset-password",{email,otp,newPassword})
      if(data.success){
        setState("Login")
        navigate("/login")
        toast.success(data.message)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  return (
    <div className='relative min-h-screen bg-[url("bg_img.jpg")] flex justify-center items-center'>
      <img onClick={()=>navigate("/")} className='absolute top-1 left-4 sm:left-6 w-36 sm:w-40' src={assets.logo} />
      {/* enter email */}
      {!isEmailSubmitted &&
        <form onSubmit={(e)=>handleEmailSubmition(e)} action="" className='flex flex-col items-center bg-gradient-to-b from-[#83d2ec] to-white p-10 rounded-xl shadow-xl '>
          <h1 className='text-xl sm:text-3xl font-semibold underline mb-1'>Reset Password</h1>
          <p className='text-md sm:text-lg mb-6'>Enter your Email</p>
          <div className='flex items-center gap-2  px-2 py-2 mb-5 rounded-2xl bg-gray-200'>
            <LuMail />
            <input required onChange={(e) => setEmail(e.target.value)} value={email} className='outline-none text-md text-gray-600' type="email" placeholder='Email Id' />
          </div>
          <button type='submit' className='w-full cursor-pointer rounded-full px-2 py-1.5 bg-gradient-to-r text-blue-900 font-semibold from-blue-400 to-blue-200'>Send Otp</button>
        </form>
      }
      {/* submit otp */}
      {isEmailSubmitted && !isOtpSubmitted &&
        <form onSubmit={(e)=>handleOtpSubmition(e)} onPaste={(e) => handlePaste(e)} action="" className='flex flex-col items-center bg-gradient-to-b from-[#83d2ec] to-white p-10 rounded-xl shadow-xl '>
          <h1 className='text-xl sm:text-3xl font-semibold underline mb-1'>Reset Password</h1>
          <p className='text-md sm:text-lg mb-6'>Enter otp sent on your email</p>
          <div className='flex items-center gap-2  px-2 py-2 mb-5'>
            {Array(6).fill(0).map((_, index) => (
              <input type="text" key={index} ref={(e) => inputRefs.current[index] = e} onInput={(e) => handleInput(e, index)} onKeyDown={(e) => handleBackspace(e, index)} maxLength="1" className='size-12 bg-gray-400 text-center rounded-md' />
            ))}
          </div>
          <button type='submit' className='w-full cursor-pointer rounded-full px-2 py-1.5 bg-gradient-to-r text-blue-900 font-semibold from-blue-400 to-blue-200'>Submit</button>
        </form>
      }
      {/* submit newpassword */}
      {isEmailSubmitted && isOtpSubmitted &&
        <form onSubmit={(e)=>handleNewPasswordSubmittion(e)} action="" className='flex flex-col items-center bg-gradient-to-b from-[#83d2ec] to-white p-10 rounded-xl shadow-xl '>
          <h1 className='text-xl sm:text-3xl font-semibold underline mb-1'>New Password</h1>
          <p className='text-md sm:text-lg mb-6'>Enter New Password</p>
          <div className='flex items-center gap-2  px-2 py-2 mb-5 rounded-2xl bg-gray-200'>
            <LuLock />
            <input required onChange={(e) => setNewPassword(e.target.value)} value={newPassword} className='outline-none text-md text-gray-600' type="password" placeholder='New Password' />
          </div>
          <button type='submit' className='w-full cursor-pointer rounded-full px-2 py-1.5 bg-gradient-to-r text-blue-900 font-semibold from-blue-400 to-blue-200'>Reset Password</button>
        </form>
      }
    </div>
  )
}

export default ResetPassword

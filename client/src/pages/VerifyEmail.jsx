import React, { useContext, useRef } from 'react'
import assets from '../assets/assets'
import {toast} from "react-hot-toast"
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import AppContext from '../context/appContext'
const VerifyEmail = () => {
  const inputRefs = useRef([])
  const {backendUrl}=useContext(AppContext)
  const navigate=useNavigate()
  axios.defaults.withCredentials=true

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

  const handlePasteOtp=(e)=>{
    const otpString=e.clipboardData.getData("text")
    const otpArray=otpString.split("")
    otpArray.map((item,index)=>{
      return inputRefs.current[index].value=item
    })
  }

  const handleVerifyEmailSubmition=async(e)=>{
    e.preventDefault()
    const otpArray=inputRefs.current.map((item,index)=>{
      return inputRefs.current[index].value
    })
    const otp=otpArray.join("")        
    try {
      const {data}=await axios.post(backendUrl+"/api/auth/verify-account",{otp})
      if(data.success){
        navigate("/")
        toast.success(data.message)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  return (
    <div className='relative min-h-screen bg-[url("/bg_img.jpg")] flex justify-center items-center'>
      <img onClick={()=>navigate("/")} className='absolute top-1 left-4 sm:left-6 w-36 sm:w-40' src={assets.logo} />
      <form onSubmit={(e)=>handleVerifyEmailSubmition(e)} onPaste={(e)=>handlePasteOtp(e)} action="" className='text-center flex flex-col items-center justify-center bg-gradient-to-b from-[#83d2ec] to-white p-10 rounded-xl shadow-xl'>
        <h1 className='text-xl sm:text-2xl font-semibold mb-2'>Account Verification</h1>
        <p className='mb-4'>Enter Otp sent on your Email id</p>
        <div className='flex justify-between gap-2 mb-4'>
          {Array(6).fill(0).map((_, index) => (
            <input key={index} ref={(e) => inputRefs.current[index] = e} maxLength="1" onInput={(e) => handleInput(e, index)} onKeyDown={(e)=>handleBackspace(e,index)} className='bg-gray-400 size-12 text-center text-xl rounded-md' required />
          ))}
        </div>
        <button className='w-full cursor-pointer bg-gradient-to-r from-blue-400 to-gray-300 px-2 py-1 text-lg rounded-full'>Submit</button>
      </form>
    </div>
  )
}

export default VerifyEmail

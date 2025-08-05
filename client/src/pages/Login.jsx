import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { LuLock, LuUser } from "react-icons/lu";
import { LuMail } from "react-icons/lu";
import AppContext from "../context/appContext"
import axios from "axios"
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';




const Login = () => {
  const { backendUrl, state, setState,setIsAuth } = useContext(AppContext)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")

  const navigate=useNavigate()
  
  axios.defaults.withCredentials=true
  const register=async(e)=>{
    e.preventDefault()
    try {
      const {data}=state==="Sign Up"? await axios.post(backendUrl+"/api/auth/register",{name,email,password})
      :await axios.post(backendUrl+"/api/auth/login",{email,password})
      if(data.success){
        setIsAuth(true)
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
      <img onClick={()=>navigate("/")} className='absolute top-1 cursor-pointer left-4 sm:left-6 w-36 sm:w-40' src={assets.logo} />
      <form onSubmit={(e)=>register(e)} action="" className='flex flex-col items-center bg-gradient-to-b from-[#83d2ec] to-white p-10 rounded-xl shadow-xl '>
        <h1 className='text-xl sm:text-3xl font-semibold underline mb-1'>{state==="Sign Up"?"Create Your Account":"Welcome Back!"}</h1>
        <p className='text-md sm:text-lg mb-6'>{state==="Sign Up"?"Enter your details to sign up.":"Enter your credentials to log in."}</p>
        {state === "Sign Up" && <div className='flex items-center gap-2  px-2 py-2 mb-5 rounded-2xl bg-gray-200'>
          <LuUser />
          <input required onChange={(e)=>setName(e.target.value)} value={name} className='outline-none text-md text-gray-600' type="text" placeholder='Full Name' />
        </div>}
        <div className='flex items-center gap-2  px-2 py-2 mb-5 rounded-2xl bg-gray-200'>
          <LuMail />
          <input required onChange={(e)=>setEmail(e.target.value)} value={email} className='outline-none text-md text-gray-600' type="email" placeholder='Email Address' />
        </div>
        <div className='flex items-center gap-2  px-2 py-2 mb-0.5 rounded-2xl bg-gray-200'>
          <LuLock />
          <input required onChange={(e)=>setPassword(e.target.value)} value={password} className='outline-none text-md text-gray-600' type="password" placeholder='Password' />
        </div>
        {state==="Login" && <p onClick={()=>navigate("/reset-password")} className='ml-32 text-sm underline cursor-pointer hover:text-red-300'>Forgot Password?</p>}
        {state === "Sign Up" ?
          <p className='text-md mb-5'>Already have account,
            <span onClick={() => setState("Login")} className='underline hover:text-red-500 cursor-pointer'>Login here</span>
          </p>
          : <p className='text-md mb-5'>Do not have account,
            <span onClick={() => setState("Sign Up")} className='underline hover:text-red-500 cursor-pointer'>Sign Up here</span>
          </p>}
        <button type='submit' className='w-full cursor-pointer rounded-full px-2 py-1.5 bg-gradient-to-r text-blue-900 font-semibold from-blue-400 to-blue-200'>{state}</button>
      </form>
    </div>
  )
}

export default Login

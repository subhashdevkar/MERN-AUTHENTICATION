import React, { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets.js'
import { LuArrowRight } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import AppContext from "../context/appContext.js"
import toast from 'react-hot-toast';
import axios from 'axios';


const Navbar = () => {
  const { isAuth, setIsAuth, handleIsAuth, userData, handleGetUserData, backendUrl } = useContext(AppContext)
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  axios.defaults.withCredentials = true

  const handleVerifyEmailOtp = async () => {
    try {
      const { data } = await axios.post(backendUrl + "/api/auth/send-verify-otp")
      if (data.success) {
        navigate('/verify-email')
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleLogOut = async () => {
    try {
      const { data } = await axios.post(backendUrl + "/api/auth/logout")
      if (data.success) {
        setIsAuth(false)
        toast.success(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  console.log(isOpen);

  useEffect(() => {
    handleIsAuth()
    handleGetUserData()
  }, [])

  return (
    <div className='flex justify-between px-4 sm:px-6 items-center'>
      <img className='w-36 sm:w-40' src={assets.logo} />
      {isAuth === true ?
        <div onClick={() => setIsOpen(!isOpen)} className='text-center group relative flex justify-center items-center bg-blue-800  text-white  size-10 rounded-full mb-2 cursor-pointer'>
          <span className='text-xl font-bold'>{userData.name?.charAt(0)?.toUpperCase()}</span>
          {isOpen &&
            <ul className='absolute  top-0 mt-10 font-normal text-sm right-0 bg-gray-400'>
              {!userData.isAccountVerified &&
                <li onClick={handleVerifyEmailOtp} className='bg-gray-200 m-1 text-black p-1'>Verify Account</li>
              }
              <li onClick={handleLogOut} className='bg-gray-200 m-1 text-black p-1'>Log Out</li>
            </ul>
          }
        </div>
        : <div onClick={() => navigate("/login")} className='flex items-center font-medium hover:bg-gray-300 transition-all cursor-pointer justify-center gap-2 rounded-full border px-4 py-1.5'>
          Login
          <LuArrowRight />
        </div>
      }
    </div>
  )
}

export default Navbar

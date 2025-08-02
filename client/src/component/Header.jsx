import React, { useContext, useEffect } from 'react'
import assets from '../assets/assets'
import AppContext from "../context/appContext";
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { userData, isAuth,handleIsAuth } = useContext(AppContext)
  const navigate=useNavigate()
  useEffect(()=>{
    handleIsAuth()
  },[])
  
  return (
    <div className='flex flex-col items-center mt-16 p-4 text-center text-black'>
      <img className='size-36 rounded-full mb-3' src={assets.robot_img} />
      <h1 className='text-2xl sm:text-4xl font-semibold mb-2'>Hey! {(userData.name?.charAt(0)?.toUpperCase() + userData.name?.slice(1)) || "Developer"}
      </h1>
      <h3 className='text-xl sm:text-2xl mb-3'>Welcome to our app</h3>
      <p className='max-w-md text-sm mb-3'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fuga, hic pariatur? Delectus
        illo alias eaque tempore laboriosam, quidem ipsam temporibus, inventore, totam natus quod
        porro explicabo aperiam rerum! Ducimus tenetur officiis commodi pariatur quaerat.
      </p>
      {!isAuth && 
      <button onClick={()=>navigate("/login")} className='border cursor-pointer hover:bg-gray-300 transition-all rounded-full px-4 py-2.5'>Get Started</button>
      }
    </div>
  )
}

export default Header

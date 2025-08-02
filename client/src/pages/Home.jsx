import React from 'react'
import Navbar from '../component/Navbar'
import assets from '../assets/assets'
import Header from '../component/Header'

const Home = () => {
  return (
    <div className='bg-[url("bg_img.jpg")] min-h-screen flex-col'>
      <Navbar />
      <Header/>
    </div>
  )
}

export default Home

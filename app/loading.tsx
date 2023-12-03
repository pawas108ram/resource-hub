'use client'
import React from 'react'
import Lottie from 'lottie-react'
import animation from '@/public/loading.json'

const LoadingPage = () => {
  return (
      <div className='h-screen w-full bg-black text-white flex flex-row items-center justify-center '>
          <Lottie animationData={animation} loop={true} className='h-[500px] w-[500px] text-white ' />
      
    </div>
  )
}

export default LoadingPage

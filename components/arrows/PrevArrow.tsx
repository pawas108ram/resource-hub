import React from 'react'
import { BsChevronLeft } from 'react-icons/bs'

const PrevArrow = () => {
  return (
      <div className='absolute right-[80p] -top-[80px] '>
          <div className='bg-black h-[50px] w-[50px] rounded grid place-items-center cursor-pointer text-white '>
          <BsChevronLeft/></div>
      
    </div>
  )
}

export default PrevArrow

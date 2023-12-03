import React from 'react'
import { BsChevronRight } from 'react-icons/bs'

const NextArrow = () => {
  return (
      <div className='absolute right-0 -top-[80px] '>
          <div className='bg-black h-[50px] w-[50px] rounded grid place-items-center cursor-pointer text-white '>
          <BsChevronRight/></div>
      
    </div>
  )
}

export default NextArrow

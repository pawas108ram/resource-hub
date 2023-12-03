'use client'
import Heading from '@/components/Heading'

import React, { useState } from 'react'
import { MdClose, MdInfo } from 'react-icons/md'

const InstrctionsModal = ({onClose,instructions}:{onClose:()=>void,instructions:string[]}) => {
    return (
        <div className='fixed inset-0 bg-black/60 flex flex-row items-center justify-center z-[999999] '>
            <div className='flex flex-col items-center gap-2 bg-black text-white  rounded p-2 lg:w-3/5 xs:w-5/6 relative'>
                <button className='bg-red-600 p-3 rounded-full -top-5 -right-5 absolute' onClick={()=>onClose()}><MdClose/></button>
                <Heading body='Instructions for Resource' className='underline' />
                <ul className='bg-black  p-3 w-full rounded flex flex-col gap-1.5 '>
                    {instructions.map((instruction,ele) => (
                        <li key={ele} className='bg-black outline-white outline-1 outline text-white p-1 rounded w-full '>{instruction}</li>
                    ))}
                </ul>

            </div>
        </div>
    )
}

const InstructionComponent = ({ instructions }: { instructions: string[] }) => {
    const [show, setShow] = useState(false);

  return (
      <>
          {show && <InstrctionsModal instructions={instructions} onClose={()=>setShow(false)} />}
        <button className='flex flex-row items-center gap-2 bg-white/10  py-1 px-4 rounded text-blue-700' onClick={()=>setShow(true)}>
        <MdInfo />
        Click to see How to use this resource
        </button>
    </>
  )
}

export default InstructionComponent

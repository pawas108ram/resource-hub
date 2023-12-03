import CodeComponent from '@/app/(dashboard-layout)/question/[sheetId]/[questionId]/components/CodeComponent'

import React from 'react'
import Heading from '../Heading'
import { MdClose } from 'react-icons/md'

const SolutionCreationModal = ({questionId,onClose}:{questionId:number,onClose:()=>void}) => {
  return (
      <div className='fixed inset-0 w-full h-screen bg-black/60 z-[99999] flex flex-row items-center justify-center '>
          <div className='h-full w-full flex flex-col overflow-y-auto bg-black  text-white rounded p-4 gap-4 relative'>
              <button className='text-white p-3 rounded-full bg-white/20  absolute top-3 right-3' onClick={()=>onClose()}><MdClose/></button>
          <Heading body='Post your Approach' className=' border-b-4 border-white p-2 ' />
              <CodeComponent questionId={questionId} />
          </div>
      
    </div>
  )
}

export default SolutionCreationModal

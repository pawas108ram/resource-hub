import React from 'react'
import Heading from '../Heading'
import CreationForm from '@/app/(dashboard-layout)/create/components/CreationForm'
import { MdClose } from 'react-icons/md'

const AddSheetResourceModal = ({onClose}:{onClose:()=>void}) => {
  return (
      <div className='fixed inset-0 bg-black/80 z-[999999] flex flex-row items-center justify-center   '>
          
          <div className='flex flex-col   lg:w-4/6 lg:h-auto p-16 rounded gap-8 relative  xs:p-4 xs:w-5/6 xs:h-4/5'>
              <button className='absolute -top-5 -right-5 bg-red p-4 rounded-full bg-red-500' onClick={onClose}><MdClose size={20} /></button>
              <Heading body='Add Resource or Sheet' className='text-center text-white' />
        <CreationForm onClose={onClose} />
          </div>
          
      
    </div>
  )
}

export default AddSheetResourceModal

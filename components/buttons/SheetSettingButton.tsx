'use client'
import { DeleteSheet } from '@/app/_actions/DeleteSheet';
import { Sheet } from '@prisma/client'
import React, { useState } from 'react'
import { MdCancel, MdClose, MdSettings } from 'react-icons/md';
import UpdateSheetModal from '../modals/UpdateSheetModal';

const SettingButton = ({ sheet }: { sheet: Sheet }) => {
    const [settingShow, setSettingShow] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
  return (
      <div className='relative ' >
          {updateModal && <UpdateSheetModal sheet={sheet!} onClose={()=>setUpdateModal(false)} />}
          {settingShow && !updateModal &&  <div className='absolute  p-4 w-40 h-40 top-0 right-10 bg-black rounded flex flex-col text-white text-sm items-center gap-2 z-40 ' >
                  <span className='border-b-2 w-full text-center  border-white text-lg font-bold'>Settings</span>
                  <button className='bg-gray-100 w-full text-black rounded shadow font-semibold py-1 px-4' onClick={()=>setUpdateModal(true)}>Edit</button>
                  <button className='bg-red-500 w-full text-black rounded shadow font-semibold py-1 px-4' onClick={()=>DeleteSheet(sheet?.id)}>Delete</button>
              </div>}
         
          
          
          <button onClick={() => setSettingShow((prev) => !prev)} className=' text-white p-2 rounded-full ' style={{backgroundColor:settingShow?'red':'black'}}>{!settingShow ? <MdSettings size={20} /> : <MdClose size={20} />}</button>
              
          
          
              
      </div>
  )
}

export default SettingButton

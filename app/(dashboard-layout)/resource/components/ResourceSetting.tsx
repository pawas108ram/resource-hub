'use client'
import clsx from 'clsx';
import React, { useState } from 'react'
import { MdClose, MdSettings } from 'react-icons/md';
import { motion } from 'framer-motion';
import { DeleteResource } from '@/app/_actions/DeleteResource';

import UpdateResourceModal from './UpdateResourceModal';
import { FullResourceType } from '../layout';

const ResourceSetting = ({resource}:{resource:FullResourceType}) => {
    const [showSetting, setShowSetting] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
  return (
      <>
          {updateModal && <UpdateResourceModal resource={resource} onClose={()=>setUpdateModal(false)} />}
          <div className='relative'>
              <button className={clsx('p-2 rounded-full text-white ',showSetting?'bg-red-500':'bg-black')} onClick={()=>setShowSetting((prev)=>!prev)}>{showSetting ? <MdClose size={20} /> : <MdSettings size={20} />}</button>
              { <motion.div className='absolute  p-4 w-40 h-40 top-0 right-10 bg-black/90 rounded flex flex-col text-white text-sm items-center gap-2 z-40 ' animate={showSetting ? 'show' : 'hide'}
                  variants={{
                      show: { opacity: 1, display: 'flex',scaleX:1,transformOrigin:'top right' },
                        hide: { opacity: 0, display: 'none' , scaleX:0,transformOrigin:'top right'}
              }} transition={{duration:0.3,delay:0.1}}>
                      <span className='border-b-2 w-full text-center  border-white text-lg font-bold'>Settings</span>
                      <button className='bg-gray-100 w-full text-black rounded shadow font-semibold py-1 px-4' onClick={()=>setUpdateModal(true)} >Edit</button>
                      <button className='bg-red-500 w-full text-black rounded shadow font-semibold py-1 px-4' onClick={()=>DeleteResource(resource.id)}>Delete</button>
                  </motion.div>}
              </div>
      </>
  )
}

export default ResourceSetting

'use client'
import { dateString } from '@/app/libs/utility functions/dateString';
import { Tooltip } from '@mui/material';
import Link from 'next/link';
import React, { useState } from 'react'
import { AiFillDelete } from 'react-icons/ai';
import DeleteModal from './DeleteModal';
import { Resource } from '@prisma/client';
interface ResourceCardItemProps{
  id: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  
  
}

const ResourceCardItem: React.FC<ResourceCardItemProps> = ({ id, title, createdAt, updatedAt }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  return (
    <>
      {isModalOpen && <DeleteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isSheet={false} sheetId={id}  />}
      <div  className='flex flex-col  gap-2'>
      <span className='text-sm font-semibold text-white'>#Resource {id}</span>
      <div className="flex flex-row justify-between items-center p-3 hover:bg-gray-500 hover:scale-105 transition duration-500 bg-gray-100 rounded">
          <Link href={`/resource/${id}` } className='text-md font-semibold'>{title}</Link>
          <div className='flex flex-col gap-2 text-xs font-medium xs:hidden lg:flex'>
              <span>Created At: {dateString(new Date(createdAt))}</span>
            <span>Updated At: {dateString(new Date(updatedAt))}</span>
           
          </div>
          <Tooltip title='Delete Sheet' placement='top-start'><button className='p-3 hover:bg-red-600 hover:scale-105 transition duration-500  rounded-full bg-red-500 text-white' onClick={()=>setIsModalOpen(true)}><AiFillDelete size={18} /></button></Tooltip>
      
      </div>
      
      
      </div>
    </>
  )
}

export default ResourceCardItem

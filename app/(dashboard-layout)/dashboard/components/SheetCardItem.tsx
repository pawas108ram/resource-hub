'use client'
import axios from 'axios';
import Link from 'next/link';
import React, { ReactEventHandler, useState } from 'react'
import toast from 'react-hot-toast';
import { AiFillDelete } from 'react-icons/ai';
import DeleteModal from './DeleteModal';
import { dateString } from '@/app/libs/utility functions/dateString';
import { Tooltip } from '@mui/material';
import { Resource, Sheet } from '@prisma/client';
interface SheetCardItemProps {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    
   
    

}

const SheetCardItem: React.FC<SheetCardItemProps> = ({ id, createdAt, updatedAt, title }) => {
    
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    
    return (
      <>
            {isModalOpen && <DeleteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isSheet={true} sheetId={id}   />}
          <div  className='flex flex-col  gap-2 '>
              <span className='text-sm font-semibold text-white'>#Sheet {id}</span>
              <div  className="flex flex-row justify-between items-center p-3  hover:bg-gray-500 hover:scale-105 transition duration-500 bg-gray-100 rounded gap-2">
                  <Link href={`/sheet/${id}`} className='text-md font-semibold truncatestyle-1'>{title}</Link>
                  <div className='flex flex-col gap-2 text-xs font-medium xs:hidden lg:flex'>
                        <span className='whitespace-nowrap'>Created At: {dateString(new Date(createdAt))}</span>
                        <span className='whitespace-nowrap'>Updated At: {dateString(new Date(updatedAt))}</span>
          
                  </div>
                  <Tooltip title='Delete Sheet' placement='top-start'><button className='p-3 hover:bg-red-600 hover:scale-105 transition duration-500  rounded-full bg-red-500 text-white' onClick={()=>setIsModalOpen(true)}><AiFillDelete size={18} /></button></Tooltip>
              </div>
          
          </div>
      </>
  )
}

export default SheetCardItem

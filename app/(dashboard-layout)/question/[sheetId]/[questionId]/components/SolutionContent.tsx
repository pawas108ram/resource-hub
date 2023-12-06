'use client'
import { dateString } from '@/app/libs/utility functions/dateString'
import { Sheet, Solution } from '@prisma/client'
import React, { useState } from 'react'
import {IoIosEyeOff,IoIosEye} from 'react-icons/io'
import MainSolutionComponent from './MainSolutionComponent'
import { MdDelete, MdEdit } from 'react-icons/md'
import EditSolutionModal from '@/components/modals/EditSolutionModal'
import { DeleteSolutionById } from '@/app/_actions/DeleteSolutionById'

const SolutionContent = ({ sol }: { sol: Solution }) => {
  const [solution, showSolution] = useState(false);
  const [editSolution, setEditSolution] = useState(false);
  
  return (
    <>
      {editSolution && <EditSolutionModal onClose={()=>setEditSolution(false)} sol={sol} />}
      <div className="flex flex-col gap-1">
          <div className='bg-white xs:py-0.5 xs:px-1 xs:gap-y-0.5 py-2 rounded flex xl:flex-row items-center text-black justify-around px-6 xs:flex-col  xs:items-center xl:items-start w-full '>
          <span className='font-bold text-lg  xl:w-3/12 truncatestyle-1 xs:w-full xs:text-center xl:text-start'>{sol.title}</span>
          <div className='flex flex-col gap-0.5  xl:w-3/12 xs:w-full xs:items-center'>
            <span className='whitespace-nowrap text-xs font-semibold'>
              Created:-{dateString(new Date(sol.createdAt))}
            </span>
            <span className='whitespace-nowrap text-xs font-semibold'>
              Updated:-{dateString(new Date(sol.updatedAt))}
            </span>
      
          </div>
          <div className="flex flex-row  items-center xl:w-5/12 justify-around gap-1 xs:w-full ">
            <span className='font-semibold text-base whitespace-nowrap flex flex-row items-center w-4/6 '>Language:-{sol.language}</span>
                    <button className='p-2 rounded-full bg-black text-white   font-extrabold  ' onClick={() => showSolution((prev) => !prev)}>{solution ? <IoIosEyeOff size={16}   /> : <IoIosEye size={16}  />}</button>
            <button className='flex flex-row items-center gap-2 bg-black text-white rounded-full p-2  ' onClick={() => setEditSolution(true)}><MdEdit size={16} /></button>
            <button className='flex flex-row items-center gap-2 bg-red-500 text-white rounded-full p-2  ' onClick={()=>DeleteSolutionById(sol.id)}><MdDelete size={16} /></button>
            
          </div>
      
            </div>
            {solution && <MainSolutionComponent sol={sol} />}
      </div>
    </>
  )
}

export default SolutionContent

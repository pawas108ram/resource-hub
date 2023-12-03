'use client'
import React, { useEffect, useState } from 'react'
import { FullResourceType, FullResourceTaskType } from '../../layout';
import { MdClose, MdEdit } from 'react-icons/md'
import SubHeading from '@/components/SubHeading'
import { BiSolidPlusSquare } from 'react-icons/bi'
import Content from '@/components/Content'
import Select from 'react-select';
import TaskModal from './TaskModal'
import TaskCard from './TaskCard'
import ResourceInstructionModal from './ResourceInstructionModal'
import PublishStatusModal from '@/components/modals/PublishStatusModal'
import { pusherClient } from '@/app/libs/pusher';
import { PublishStatus } from '@prisma/client';

const EditResourceModal = ({ onClose, resource ,tasks,status}: { onClose: () => void, resource: FullResourceType,tasks:FullResourceTaskType[],status:PublishStatus }) => {
    const [instructions, setInstructions] = useState<string[]>(resource.instructions || []);
    
    const [taskModal, setTaskModal] = useState<boolean>(false);
    const [instructionModal, setInstructionModal] = useState<boolean>(false);
    const [resourceStatusModal, setResourceStatusModal] = useState<boolean>(false);
   
  
    


    
    
  return (
      <>
          
          <div className='flex flex-row items-center justify-center bg-black/60 fixed inset-0 z-[99999]'>
              {instructionModal && <ResourceInstructionModal onClose={() => setInstructionModal(false)} resourceId={resource.id} instructions={resource.instructions} />}
              {taskModal && <TaskModal onClose={() => setTaskModal(false)} resourceId={resource.id} />}
              {resourceStatusModal && <PublishStatusModal onClose={() => setResourceStatusModal(false)} resourceId={resource.id} status={status} />}
              <div className='flex flex-col bg-black/90 text-white rounded p-2 lg:w-3/5 xs:w-5/6 gap-3 relative h-4/5 xs:overflow-y-auto lg:overflow-hidden '>
                  <button className='bg-red-500 p-3 rounded-full absolute top-2 right-2  ' onClick={() => onClose()}><MdClose /></button>
                  <div className="flex flex-row items-center lg:justify-between lg:px-6 w-full p-1 xs:gap-1  xs:justify-center">
                      <SubHeading body='Modify Your Resource' className='underline xs:text-lg lg:text-2xl' />
                      <button className='bg-blue-500 text-white py-2 px-4 font-semibold rounded xs:text-sm lg:text-xl' onClick={()=>setResourceStatusModal(true)}>{status}</button>
                  </div>
                  <Content body='Add instructions for how to use Resource' className='underline' />
                  <button className='bg-red-500 font-medium text-white py-2 px-4 rounded self-start' onClick={()=>setInstructionModal(true)}>Edit/Add Guidelines for Resource</button>
                  {instructions.length === 0 ? <span className='bg-white/10 text-white rounded p-2 w-full'>No Instructions Added</span> : <div className='flex flex-col gap-1 bg-black p-3 rounded '>
                      {instructions.map((instruction, ele) => (
                          <span key={ele} className='bg-black/90 text-white rounded p-2 w-full outline-white outline outline-1'>{instruction}</span>
                      ))}
                    </div>}
                  <button className='bg-blue-600 font-medium text-white py-2 px-4 rounded self-start ' onClick={()=>setTaskModal(true)}>Click Here to Add Your Tasks</button>
                  <Content body='Current Tasks' className='underline' />
                  {tasks.length === 0 ? <span className='bg-white/50 text-black text-center font-semibold lg:text-xl xs:text-sm rounded p-2 w-full'>No Tasks Added</span> : <div className='flex flex-col gap-1 bg-black p-3 rounded h-full overflow-y-auto'>
                      {tasks.map((task, ele) => (
                          <TaskCard key={ele} task={task} isAuthor={true} resourceId={resource.id} />
                        ))}
                  </div>}
          
          
          
              </div>
          </div>
      </>
  )
}

export default EditResourceModal

'use client'
import React, { useEffect, useState } from 'react'
import { FullResourceTaskType } from '../../layout'
import Content from '@/components/Content'
import { MdDelete, MdEdit } from 'react-icons/md'
import { IoMdEye, IoMdEyeOff } from 'react-icons/io'
import clsx from 'clsx';
import SubHeading from '@/components/SubHeading'
import LinkFolder from './LinkFolder'
import { DeleteTaskByTaskId } from '@/app/_actions/DeleteTaskByTaskId'
import EditTaskCardModal from './EditTaskCardModal'
import { motion } from 'framer-motion'
import { QuestionStatus, TaskStatus } from '@prisma/client'
import toast from 'react-hot-toast'
import { FaClock } from 'react-icons/fa'

export const  TaskCardBgColorByStatus=(taskStatus: TaskStatus)=>{
  switch (taskStatus) {
    case 'UNCOMPLETE':
      return 'bg-red-500/60'
    case 'COMPLETE':
      return 'bg-green-500/60'
    case 'PENDING':
      return 'bg-yellow-500/60'
    case 'LATER':
      return 'bg-orange-500/60'
    default:
      return 'bg-gray-400/60'
  }
}
export const TaskCardColorByStatus = (taskStatus: TaskStatus) => {
  switch (taskStatus) {
    case 'UNCOMPLETE':
      return 'text-red-500'
    case 'COMPLETE':
      return 'text-green-500'
    case 'PENDING':
      return 'text-yellow-500'
    case 'LATER':
      return 'text-orange-500'
    default:
      return 'text-gray-500'
  }
}

export const TaskCardStatus:{value:TaskStatus,label:string}[] = [
  { value: 'UNCOMPLETE', label: 'UNCOMPLETE' },
  { value: 'COMPLETE', label: 'COMPLETE' },
  { value: 'PENDING', label: 'PENDING' },
  {value:'LATER',label:'LATER'}
  
]
const TaskCard = ({ task ,isAuthor ,resourceId}: { task: FullResourceTaskType,isAuthor:boolean,resourceId:number }) => {
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [editTask, setEditTask] = useState(false);
  const [taskStatus, setTaskStatus] = useState<TaskStatus>('UNCOMPLETE');
  useEffect(() => {
    if (task && task.taskStatus && task.taskStatus.length !== 0) {
      setTaskStatus(task.taskStatus[0].status);
    }
  },[task])
  const handleTaskStatusChange = async(e: React.ChangeEvent<HTMLSelectElement>) => {
    setTaskStatus(e.currentTarget.value as TaskStatus);
    const res = await fetch(`/api/tasks/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: e.currentTarget.value, taskId: task.id ,resourceId})
    });
    if (res.ok) {
      toast.success('Task Status Updated Successfully');

    }
    else {
      const text = await res.text();
      toast.error(text);
    }
  }

  return (
    <>
      {editTask && <EditTaskCardModal task={task} onClose={()=>setEditTask(false)} />}
      <div className={clsx('flex flex-col gap-1  text-white rounded lg:p-1 xs:p-0 ',TaskCardBgColorByStatus(taskStatus))}>
        <div className='flex lg:flex-row items-center lg:justify-between xs:flex-col xs:gap-0.5'>
          <span className='font-semibold'>Title: {task.title}</span>
          <div className='flex flex-row items-center gap-2 bg-gray-400/60 p-1 rounded'>
            {isAuthor && <button className='p-2 bg-red-500 text-white rounded-full' onClick={() => DeleteTaskByTaskId(task.id)}><MdDelete /></button>}
            {isAuthor && <button className='p-2 bg-black text-white rounded-full' onClick={() => setEditTask(true)}><MdEdit /></button>}
            <button className={clsx('p-2   rounded-full',showTaskDetails? 'bg-gray-700 text-black':'bg-green-500 text-white ')}  onClick={()=>setShowTaskDetails((prev)=>!prev)}>{showTaskDetails ? <IoMdEyeOff /> : <IoMdEye />}</button>
          </div>
        </div>
        {  <motion.div animate={showTaskDetails ? 'show' : 'hide'}
          variants={{
            show: {
              opacity: 1,
              scaleY: 1,
              scaleX:1,
              transition: {
                duration: 0.5
              }
              ,
              display: 'flex'
            },
            hide: {
              opacity: 0,
              scaleY: 0,
              scaleX:0,
              display: 'none',
              transition: {
                duration: 0.5
              }
            }
          }}
          className='flex flex-col gap-1 bg-gray-200/40 p-1 rounded'>
          <div className="flex lg:flex-row items-center gap-3 xs:flex-col xs:gap-0.5">
            <Content body='Status of the Task' className='xs:text-sm lg:text-xl' />
            <select name="status" id="status" className={clsx('py-2 lg:px-4 xs:px-2   w-48 text-black rounded xs:text-xs lg:text-base')} value={taskStatus} onChange={(e) => handleTaskStatusChange(e)}>
              {TaskCardStatus.map((status) => (
                <option  value={status.value} key={status.value } className={clsx(TaskCardColorByStatus(status.value))}>{status.label}</option>
              ))}
                          
                     </select>
            
          </div>
          <Content body='Description' className='xs:text-sm lg:text-xl' />
          <span className='bg-black/60 p-1 text-white rounded xs:text-xs lg:text-base'>{task.description}</span>
          <div className='flex flex-row items-center lg:gap-2 xs:gap-0.5 w-full xs:text-xs lg:text-base'>
            <Content body='Estimated Duration :- ' className='xs:text-sm lg:text-lg xs:hidden lg:flex' />
            <span className='lg:hidden xs:flex'><FaClock size={20} /></span>
            <span >{task.expectedDuration}</span>
          </div>
          <LinkFolder data={task.questionLinks} folderTitle='Question Links' variant={'questionLinks'}  />
          <LinkFolder data={task.fileLinks} folderTitle='File Links' variant={'fileLinks'}  />
          <LinkFolder data={task.imageLinks} folderTitle='Image Links' variant={'imageLinks'}  />
          <LinkFolder data={task.videoLinks} folderTitle='Video Links' variant={'videoLinks'} />
          <LinkFolder data={task.websiteLinks} folderTitle='Website Links' variant={'websiteLinks'}  />
        </motion.div>}
      </div>
    </>
  )
}

export default TaskCard

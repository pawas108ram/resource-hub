'use client'
import React, { useEffect, useState } from 'react'
import { FullResourceTaskType, FullResourceType } from '../layout'

import Loader from '@/components/Loader';

import Heading from '@/components/Heading';
import { dateString } from '@/app/libs/utility functions/dateString';
import { BiSolidDislike, BiSolidLike } from 'react-icons/bi';
import SubHeading from '@/components/SubHeading';

import InstructionComponent from './components/InstructionComponent';
import { PublishStatus, Task, TaskStatus, User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import EditResourceModal from './components/EditResourceModal';
import TaskCard from './components/TaskCard';
import Image from 'next/image';
import CircularProgresswithLabel from '@mui/material/CircularProgress';
import CommentModal from '@/components/modals/CommentModal';
import { LikeByResourceId } from '@/app/_actions/LikeByResourceId';
import { DislikeByResourceId } from '@/app/_actions/DislikeByResourceId';
import Content from '@/components/Content';
import { pusherClient } from '@/app/libs/pusher';
import { MdComment, MdEdit } from 'react-icons/md';


const ResourcePage = ({ params }: { params: { resourceId: string } }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [resource, setResource] = useState<FullResourceType | null>(null);
    const session = useSession();
    const email = session?.data?.user?.email;
    const [editResourceModal, setEditResourceModal] = useState(false);
    const [completedTasks, setCompletedTasks] = useState<number>(0);
    const [pendingTasks, setPendingTasks] = useState<number>(0);
    const [laterTasks, setLaterTasks] = useState<number>(0);
    const [uncompleteTasks, setUncompleteTasks] = useState<number>(0);
    const [commentModal, setCommentModal] = useState(false);
    const [taskStatusFilter, setTaskStatusFilter] = useState<TaskStatus | 'ALL'>('ALL');
    const [filteredTasks, setFilteredTasks] = useState<FullResourceTaskType[]>(resource?.tasks || []);
    const [filterTaskTitle, setFilterTaskTitle] = useState('');
    const [resourceStatus,setResourceStatus]=useState<PublishStatus>('UNPUBLISHED');
   

    const taskStatusFilterOptions = [
        { value: 'UNCOMPLETE', label: 'UNCOMPLETE' },
        { value: 'COMPLETE', label: 'COMPLETE' },
        { value: 'PENDING', label: 'PENDING' },
        { value: 'LATER', label: 'LATER' },
        { value: 'ALL', label: 'ALL'}
    ]
    
    useEffect(() => {
        if (filteredTasks && filteredTasks.length!==0) {
            const completed = filteredTasks.filter((task) => (task?.taskStatus[0]?.status || 'UNCOMPLETE') === 'COMPLETE').length;
            const pending = filteredTasks.filter((task) => (task?.taskStatus[0]?.status || 'UNCOMPLETE') === 'PENDING').length;
            const later = filteredTasks.filter((task) => (task?.taskStatus[0]?.status || 'UNCOMPLETE') === 'LATER').length;
            const uncomplete = filteredTasks.filter((task) => (task?.taskStatus[0]?.status || 'UNCOMPLETE') === 'UNCOMPLETE').length;
            setCompletedTasks((completed/ filteredTasks.length )* 100);
            setPendingTasks((pending/ filteredTasks.length )* 100);
            setLaterTasks((later/ filteredTasks.length) * 100);
            setUncompleteTasks((uncomplete/ filteredTasks.length) * 100);
        }
       
        
    },[filteredTasks])
    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch(`/api/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email })
            });
            if (res.ok) {
                const data = await res.json();
                setCurrentUser(data);
            }
            else {
                const text = await res.text();
                toast.error(text);
            }
        }
        if (email) {
            fetchUser();
        }
    },[email])
   
    useEffect(() => {
        const fetchResource = async () => {
            const resource = await fetch(`/api/resources/${params.resourceId}`);
            if(resource.ok){
                const data = await resource.json();
                
                setResource(data);
                setResourceStatus(data.status);
            }
            else {
                const text = await resource.text();
                console.log(text);
            }
           
        }
        if(params.resourceId){
            fetchResource();
        }
    }, [params.resourceId])

    useEffect(() => {
        pusherClient.subscribe('resource');
        pusherClient.bind('resource:status', (data: number) => {
            if(data===resource?.id){
                setResourceStatus((prev)=>prev==='PUBLISHED'?'UNPUBLISHED':'PUBLISHED')
            }
        })
    },[resource?.id])
    
    useEffect(() => {
        
        if (resource && resource.tasks) {
            if(filterTaskTitle && taskStatusFilter!=='ALL'){
                setFilteredTasks(resource.tasks.filter((task) => (task?.taskStatus[0]?.status || 'UNCOMPLETE') === taskStatusFilter && task?.title?.toLowerCase().includes(filterTaskTitle.toLowerCase())));
            }
            if (filterTaskTitle) {
                setFilteredTasks(resource.tasks.filter((task) => task?.title?.toLowerCase().includes(filterTaskTitle.toLowerCase())));
            }
            if(taskStatusFilter!=='ALL'){
                setFilteredTasks(resource.tasks.filter((task) => task.taskStatus[0].status === taskStatusFilter));
            }
            if(!filterTaskTitle && taskStatusFilter==='ALL'){
                setFilteredTasks(resource.tasks);
            }

           
        }

        
    }, [taskStatusFilter, filterTaskTitle, resource, resource?.tasks])
    
    useEffect(() => {
        pusherClient.subscribe(`resource-${params.resourceId}`);
        pusherClient.subscribe('task');
        pusherClient.bind('create:task', (data: FullResourceTaskType) => {
            setFilteredTasks((prev) => [...prev, data]);
        })
        pusherClient.bind('delete:task', (data: number) => {
            setFilteredTasks((prev)=>prev.filter((task)=>task.id!==data))
        })
        pusherClient.bind('update:task', (data: FullResourceTaskType) => {
            setFilteredTasks((prev) => prev.map((task) => task.id === data.id ? data : task));
        }
        )
        pusherClient.bind('task:status', (data: FullResourceTaskType[]) => {
            setFilteredTasks((data))
        })
        return () => {
            pusherClient.unbind(`resource-${params.resourceId}`);
            pusherClient.unbind('create:task');
            pusherClient.unsubscribe('task');
            pusherClient.unbind('delete:task');
            pusherClient.unbind('update:task');
            pusherClient.unbind('task:status');

        }
    },[params.resourceId])
  return (
      <>
          {editResourceModal && <EditResourceModal resource={resource!} onClose={() => setEditResourceModal(false)} tasks={filteredTasks} status={resourceStatus} />}
          {commentModal && resource && currentUser && <CommentModal onClose={() => setCommentModal(false)} resourceId={resource.id} currentUserId={currentUser.id}/>}
          {resource && currentUser ?
              
              <div className='flex flex-col lg:gap-3 h-screen overflow-hidden xs:pb-32 w-full items-center bg-black text-white p-2  xs:gap-1 '>
                  
              <div className="flex flex-row items-center gap-4 xs:justify-between w-full lg:justify-center">
                      <Heading body={`${resource.title}`} className='lg:text-3xl xs:text-xl w-full text-center' />
                      
                      {currentUser && resource && currentUser.id === resource.author.id && <button className='bg-white/20 lg:py-2 lg:px-4 xs:p-4 xs:rounded-full lg:rounded text-blue-600 font-medium' onClick={() => setEditResourceModal(true)}  ><span className='xs:hidden lg:flex'>Edit Resource</span><span className='xs:flex lg:hidden'><MdEdit size={16} /></span></button>}
                  
                  </div>
                  {currentUser && resource && (currentUser.id ===resource.author.id) && <span className='bg-blue-500 text-white font-semibold lg:text-lg xs:text-sm py-2 px-4 rounded'>{resourceStatus}</span>}
             <InstructionComponent instructions={resource.instructions} />
              <div className='flex flex-row items-center gap-3 '>
                  <span className='xs:hidden lg:flex' >Author: {resource.author.name}</span>
                  <span className='xs:hidden lg:flex'>Created :{dateString(new Date(resource.createdAt))}</span>
                  <span className='xs:hidden lg:flex'>Updated :{dateString(new Date(resource.createdAt))}</span>
                  <button className='flex flex-row items-center gap-1 text-green-500' onClick={()=>LikeByResourceId(resource.id)}>
                      <BiSolidLike size={20} />
                      {resource.likes.length}
                  </button>
                  <button className='flex flex-row items-center gap-1 text-red-500' onClick={()=>DislikeByResourceId(resource.id)}>
                      <BiSolidDislike size={20} />
                      {resource.dislikes.length}
                  </button>
              </div>
              <SubHeading body='Description' />

              <span className='py-1.5 px-3 bg-white/20 text-white rounded w-full text-center lg:text-lg xs:text-sm font-medium'>{resource.description}</span>
              <div className='flex flex-row items-start bg-black/30 rounded h-full  w-full lg:p-2 xs:p-0.5 gap-3 xs:overflow-hidden lg:overflow-visible '>
                      <div className='flex flex-col gap-2 bg-white/10 h-full w-3/5 rounded   lg:p-2 xs:overflow-y-auto lg:overflow-visible xs:p-0.5' >
                          <input type="text" placeholder='Search Task by Title...' className='bg-black/90 text-white rounded p-2 lg:text-lg xs:text-sm' onChange={(e) => setFilterTaskTitle(e.target.value)} />
                            <SubHeading body='Tasks' className='xs:text-base lg:text-2xl' />
                          {filteredTasks.length === 0 ? <span className='bg-black p-2 rounded text-white lg:text-2xl font-semibold xs:text-base'>No Tasks created Yet</span> : <div className='flex flex-col gap-1.5 bg-black rounded p-2 h-full overflow-y-auto '>
                              {filteredTasks.map((task, ele) => (
                                  <div className="flex flex-col gap-0.5" key={task.id}>
                                      <span className='flex-shrink-0 text-white lg:text-base xs:text-sm font-semibold'>Task {ele + 1}</span>
                                      <TaskCard task={task} isAuthor={currentUser.id===resource.author.id} key={task.id} resourceId={resource.id} />
                                  </div>
                              ))}
                             
                              
                              

                          </div>}
                  </div>
                      <div className='flex flex-col gap-2 bg-white/10 h-full w-2/5 rounded lg:p-2 lg:overflow-visible xs:overflow-y-auto xs:p-0.5 '>
                          <SubHeading body='Progress' />
                          <div className='grid lg:grid-cols-2 lg:gap-1 xs:grid-cols-1 xs:gap-0.5  rounded bg-black/90 text-white p-2 w-full xs:text-xs lg:text-lg '>
                              <div className='flex flex-row items-center gap-1 col-span-1 text-green-500 lg:justify-center w-full xs:justify-between '>
                                  <span className=''>Completed</span>
                                  <span className=' inline-flex relative'>
                                      <CircularProgresswithLabel value={completedTasks || 0} variant='determinate' className='text-green-500' />
                                      <span className='absolute top-0 right-0 left-0 bottom-0 flex flex-row items-center justify-center text-xs '>{completedTasks}%</span>
                                  </span>
                                  
                              </div>
                              <div className='flex flex-row items-center xs:justify-between  gap-1 col-span-1 text-red-500 lg:justify-center w-full'>
                                  <span >Uncompleted</span>
                                  <span className=' inline-flex relative'>
                                      <CircularProgresswithLabel value={uncompleteTasks || 0} variant='determinate'  className='text-red-500 justify-center' />
                                      <span className='absolute top-0 right-0 left-0 bottom-0 flex flex-row items-center justify-center text-xs '>{uncompleteTasks}%</span>
                                  </span>
                              </div>
                              <div className='flex flex-row items-center gap-1 col-span-1 text-yellow-500 lg:justify-center xs:justify-between w-full'>
                                  <span >Later Tasks</span>
                                  <span className=' inline-flex relative'>
                                      <CircularProgresswithLabel value={pendingTasks || 0} variant='determinate' className='text-yellow-500' />
                                      <span className='absolute top-0 right-0 left-0 bottom-0 flex flex-row items-center justify-center text-xs '>{pendingTasks}%</span>
                                  </span>
                                  
                              </div>
                              <div className='flex flex-row items-center gap-1 col-span-1 text-orange-500 lg:justify-center w-full xs:justify-between'>
                                  <span >Pending</span>
                                  <span className=' inline-flex relative'>
                                      <CircularProgresswithLabel value={laterTasks || 0} variant='determinate' className='text-orange-500' />
                                      <span className='absolute top-0 right-0 left-0 bottom-0 flex flex-row items-center justify-center text-xs '>{laterTasks}%</span>
                                  </span>
                                  
                              </div>
                          </div>
                          <SubHeading body='Users' className='xs:hidden lg:flex' />
                          <div className="flex flex-row gap-2 items-center flex-wrap bg-black/90 py-2 rounded px-3 w-full xs:hidden lg:flex">
                { resource.users.length!==0?resource.users.map((userele) => {
                  return <div key={userele.user.id} className="flex flex-col gap-1 text-black items-center p-2 bg-blue-400 rounded-full hover:scale-110 transition duration-300  ">
                    <Image src={userele.user.image || '/images/user.png'} alt='avatar' width={20} height={20} className="h-11 w-11 rounded-full object-contain  " />
                    <span className="sr-only">{userele.user.name}</span>
                  </div>
                 
                }) : (<span className=" lg:text-xl text-center w-full text-white font-semibold xs:text-sm ">No Users using the sheet yet</span>)}
                
                          </div>
                          
                          <Content body='Filter By Task Status' className='underline xs:text-base lg:text-lg'/>
                          <select className='bg-black/90 text-white rounded p-2 xs:text-sm lg:text-base' onChange={(e) => setTaskStatusFilter(e.target.value as TaskStatus | 'ALL')}>
                                {taskStatusFilterOptions.map((option) => (
                                    <option value={option.value} key={option.value}>{option.label}</option>
                                ))}
                            </select>
                          

                          <button className='bg-blue-500 text-white font-semibold rounded py-2 px-4  flex flex-col items-center ' onClick={() => setCommentModal(true)}><span className='xs:hidden lg:flex'>See/Post Reviews</span><span className='xs:flex lg:hidden'><MdComment size={20} /></span> </button>

                          
                    </div>
                  
              </div>

              
          </div>:<div className='flex flex-row items-center justify-center h-screen w-full bg-black'><Loader/></div>}
      </>
  )
}

export default ResourcePage

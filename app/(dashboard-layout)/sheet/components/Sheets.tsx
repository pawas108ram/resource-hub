import Content from '@/components/Content';

import Link from 'next/link';
import React, { useEffect, useState } from 'react'

import { MdComment, MdLock, MdUpload } from 'react-icons/md';
import RequestModal from '@/components/modals/RequestModal';


import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '@/components/Loader';
import { dateString } from '@/app/libs/utility functions/dateString';
import UserAvatar from '@/components/UserAvatar';
import { Flame, ThumbsDown, ThumbsUp } from 'lucide-react';
import SubHeading from '@/components/SubHeading';
import CommentModal from '@/components/modals/CommentModal';
import { Tooltip } from '@mui/material';
import { FullSheetType } from '../../resource/layout';
import StoreRedirectModal from '@/components/modals/StoreRedirectModal';
interface SheetsProps{
  data: FullSheetType;
  currentUserId: number;
  currentUserKeys?: number;
}

const Sheets: React.FC<SheetsProps> = ({ data ,currentUserId,currentUserKeys}) => {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const [commentModal, setCommentModal] = useState(false);
  const [redirectStoreModal, setRedirectStoreModal] = useState(false);


  const handleUpload = () => {
    setLoading(true)

    axios.post('/api/sheets/userSheets', {
      id: data.id
    }).then(() => toast.success('Sheet Uploaded')).catch((err) => toast.error(err.response.data)).finally(() => setLoading(false));
    
  }

  const handlePrivateResourceAccess = () => {
    if (currentUserKeys && data.keys && currentUserKeys >= data.keys) {
      setIsRequestModalOpen(true);
    }
    else if(currentUserKeys && data.keys && currentUserKeys < data.keys){
      setRedirectStoreModal(true);
    }
  }

  if (loading) {
    return <Loader />
  }
  

  const onClose = () => {
    setIsRequestModalOpen(false);
  }

  
  return (
    <div className='relative w-full '>
      {(new Date(Date.now()).getMonth() === new Date(data.createdAt).getMonth()) &&  (new Date(Date.now()).getDate()-new Date(data.createdAt).getDate())<1 && <div className='flex flex-row absolute -top-2 -right-2 p-1 px-4 rounded-full bg-green-500 z-0 '>
        <span className='text-xs font-semibold text-white -z-10'>NEW</span>
      </div>}
      <div className='lg:p-4 bg-black/80 text-white rounded flex flex-col gap-2 w-full   mr-12 xs:p-1  '>
        {commentModal && <CommentModal currentUserId={currentUserId} onClose={()=>setCommentModal(false)} sheetId={data.id}  />}
      
       
        {!data.isPublic ?
          <div className='lg:p-4 bg-black/80 text-white rounded flex flex-col gap-2 w-full   mr-12 xs:p-1  '>
          {commentModal && <CommentModal currentUserId={currentUserId} onClose={()=>setCommentModal(false)} sheetId={data.id}  />}
        
            {isRequestModalOpen && data.keys && <RequestModal onClose={onClose} sheetId={data.id} currentKeys={currentUserKeys} keysNeeded={data.keys} />}
            {redirectStoreModal && data.keys && <StoreRedirectModal isSheet={true} onClose={() => setRedirectStoreModal(false)} currentUserKeys={currentUserKeys || 0} keysNeeded={data.keys}  />}
          <div className='flex flex-col gap-2 rounded p-2 bg-black text-white justify-center items-center '>
              <span className='lg:text-2xl xs:text-base font-semibold'>Title: {data.title}</span>
              <span className='lg:text-lg xs:text-sm'>Author: {data.author.name}</span>
              <span className='lg:text-lg xs:text-sm'>Pendrives Needed: {data.keys}</span>
              <div className='flex flex-col gap-3 bg-white/10 lg:p-2 w-full items-center xs:p-0'>
                  <MdLock size={24} />
                  <button className='lg:text-lg xs:text-sm font-medium' onClick={()=>handlePrivateResourceAccess()} >Make a Request to access this Sheet Here</button>
              </div>
          </div></div> : <div className='flex flex-col gap-2     '>
          <div className='flex flex-row items-center justify-around w-full gap-2'>
            <button className='bg-gray-100 p-3 rounded-full text-black ' onClick={handleUpload}><MdUpload size={20} /></button>
            <span className='text-lg  font-medium'># Sheet{data.id}</span>
          </div>
          <Link   href={`/sheet/${data.id}`}><SubHeading body={`Title:${data?.title}` || ''} className='truncatestyle-2 xs:text-base lg:text-2xl '/></Link>
          <div className="flex flex-row justify-between xs:text-sm lg:text-base">
            <Link href={`/profile/${data.author.id}`}>Author: {data.author.name}</Link>
      
            </div>
            
          <span className='text-sm xs:hidden xl:flex'>Created at:{dateString(new Date(data.createdAt))}</span>
          <span className='text-sm xs:hidden xl:flex'>Updated at:{dateString(new Date(data.updatedAt))}</span>
          <span className='text-sm'>{data.description}</span>
            <span className='xs:hidden lg:flex'>Users</span>
            <div className='flex flex-row gap-2 flex-wrap xs:hidden lg:flex'>
              {data?.users?.length !== 0 ? data?.users?.map((sheetuser) => {
                return <UserAvatar key={sheetuser.id} sheetUser={sheetuser}/>
              }):<span className='bg-black text-white p-2 rounded w-full text-center text-lg'>No Users Yet</span>}
             
              
            </div>
            <div className='flex flex-row items-center w-full justify-center gap-6 '>
              <span className='flex flex-row items-center gap-2 text-green-500 bg-gray-100 lg:py-2 lg:px-6 rounded xs:p-1'> <ThumbsUp size={32}/>:{data.likes?.length || '0'}</span>
              <span className='flex flex-row items-center gap-2 text-red-500  bg-gray-100 lg:py-2 lg:px-6 rounded xs:p-1 '><ThumbsDown size={32}/>:{data.dislikes?.length || '0'}</span>
            </div>
            <Tooltip title='Comments' placement='right-start' ><button className='bg-gray-300 py-3 px-6 flex flex-row items-center gap-4 text-black rounded text-lg justify-center font-semibold' onClick={()=>setCommentModal(true)}><span className='xs:hidden xl:flex'>Comments/Post Comment</span> <MdComment size={24} /></button></Tooltip>
      
        </div>
        }
      
      
      </div>
    </div>
  )
}


export default Sheets;

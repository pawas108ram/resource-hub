'use client'
import React, { useState } from 'react'
import { FullResourceType } from '../layout';
import { MdComment, MdLock, MdUpload } from 'react-icons/md';

import { dateString } from '@/app/libs/utility functions/dateString';
import SubHeading from '@/components/SubHeading';

import UserAvatar from '@/components/UserAvatar';
import { Tooltip } from '@mui/material';
import {  ThumbsDown, ThumbsUp } from 'lucide-react';
import CommentModal from '@/components/modals/CommentModal';

import RequestModal from '@/components/modals/RequestModal';
import toast from 'react-hot-toast';
import axios from 'axios';
import Loader from '@/components/Loader';
import Content from '@/components/Content';
import StoreRedirectModal from '@/components/modals/StoreRedirectModal';

interface ResourceCardProps{
    publicResource?: FullResourceType;
    privateResource?: FullResourceType;
    currentUserId: number;
    currentUserKeys?: number;
}

    

const ResourceCard: React.FC<ResourceCardProps> = ({ publicResource, privateResource,currentUserId,currentUserKeys }) => {
    const [commentModal, setCommentModal] = useState(false);
    const [requestModal, setRequestModal] = useState(false);
    const [loading, setLoading] = useState(false)
    const [redirectStoreModal, setRedirectStoreModal] = useState(false);
    
    

    const handleUpload = () => {
        setLoading(true)
        if (publicResource) {
            axios.post('/api/resources/userResources', {
            
                id: publicResource.id
            }).then(() => toast.success('Resource Uploaded')).catch((err) => toast.error(err.response.data)).finally(() => setLoading(false));
        
        }
    }
    const handlePrivateResourceAccess = () => {
     
           if(currentUserKeys &&  privateResource && privateResource.keys && currentUserKeys >= privateResource.keys){
               setRequestModal(true)
           } else {
                setRedirectStoreModal(true)
           }
       
    }
    
      if (loading) {
        return <Loader />
      }
      
    
      
    
  return (
      <>   
          {publicResource && <div className='flex flex-col gap-1.5 rounded p-2 bg-black/90 text-white    '>
                {commentModal && <CommentModal currentUserId={currentUserId} onClose={()=>setCommentModal(false)} resourceId={publicResource.id}  />}
              <div className='flex flex-row items-center gap-4 justify-around'>
                  <button className='text-black bg-white rounded-full p-3' onClick={()=>handleUpload()}><MdUpload /></button>
                  <span className='lg:text-lg xs:text-base font-medium'>#Resource { publicResource.id}</span>
              </div>
              <span className='lg:text-xl xs:text-base font-semibold'>Title: {publicResource.title}</span>
              <span className='lg:text-base xs:text-sm'>Author: {publicResource.author.name}</span>
              <span className='lg:text-sm xs:text-xs '>Created: {dateString(new Date(publicResource.createdAt))}</span>
              <span className='lg:text-sm xs:text-xs '>Updated: {dateString(new Date(publicResource.updatedAt))}</span>
              <span className='lg:text-sm xs:text-xs xs:truncate lg:line-clamp-2 lg:whitespace-normal py-1 px-2 bg-white/10 rounded h-12'>{publicResource.description}</span>
              <Content body='Tags' />
                <div className='flex flex-row gap-2'>
                    {publicResource.tags?.map((tag) => (
                        <span key={tag} className='bg-white/20 rounded p-2 lg:text-sm xs:text-xs font-medium'>{tag}</span>
                    ))}
                </div>
              <SubHeading body='Users' />
                <div className='flex flex-row gap-2'>
                    {publicResource.users?  publicResource.users.map((user) => (
                        <UserAvatar key={user.id} resourceUser={user} />
                    )):<span className='bg-black text-white p-2 rounded w-full text-center text-lg'>No Users Yet</span>}
              </div>
              <div className='flex flex-row items-center w-full justify-center gap-6 '>
              <span className='flex flex-row items-center gap-2 text-green-500 bg-gray-100 lg:py-2 lg:px-6 rounded xs:p-1'> <ThumbsUp size={32}/>:{publicResource.likes?.length || '0'}</span>
              <span className='flex flex-row items-center gap-2 text-red-500  bg-gray-100 lg:py-2 lg:px-6 rounded xs:p-1 '><ThumbsDown size={32}/>:{publicResource.dislikes?.length || '0'}</span>
            </div>
            <Tooltip title='Comments' placement='right-start' ><button className='bg-gray-300 py-3 px-6 flex flex-row items-center gap-4 text-black rounded text-lg justify-center font-semibold ' onClick={()=>setCommentModal(true)} ><span className='xs:hidden xl:flex'>Comments/Post Comment</span> <MdComment size={24} /></button></Tooltip>
              
          </div>}
          {privateResource && <div className='flex flex-col gap-2 rounded p-2 bg-black text-white justify-center items-center '>
              {requestModal && <RequestModal onClose={() => setRequestModal(false)} resourceId={privateResource.id} currentKeys={currentUserKeys} keysNeeded={privateResource.keys|| 1} />}
                {redirectStoreModal  && <StoreRedirectModal isSheet={false} onClose={() => setRedirectStoreModal(false)} currentUserKeys={currentUserKeys || 0} keysNeeded={privateResource.keys||1} />}
              <span className='lg:text-2xl xs:text-base font-semibold'>Title: {privateResource.title}</span>
              <span className='lg:text-lg xs:text-sm'>Author: {privateResource.author.name}</span>
              <span className='lg:text-lg xs:text-sm'>Pendrives needed: {privateResource.keys}</span>

              <div className='flex flex-col gap-3 bg-white/10 p-2 w-full items-center'>
                  <MdLock size={24} />
                  <button className='lg:text-lg xs:text-sm font-medium' onClick={()=>handlePrivateResourceAccess()} >Make a Request to access this Resource Here</button>
              </div>
          </div>}
      </>
  )
}

export default ResourceCard

import React from 'react'

import { GiPublicSpeaker } from 'react-icons/gi';
import { AiFillLock } from 'react-icons/ai';
import ResourceSetting from './ResourceSetting';
import { BiSolidDislike, BiSolidLike } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import { DislikeByResourceId } from '@/app/_actions/DislikeByResourceId';
import { LikeByResourceId } from '@/app/_actions/LikeByResourceId';
import { FullResourceType } from '../layout';
import Link from 'next/link';
import { DeleteResource } from '@/app/_actions/DeleteResource';
interface ResourceSideBarItemProps {
    ownResource?: FullResourceType;
    userResource?: FullResourceType;
}


const ResourceSideBarItem:React.FC<ResourceSideBarItemProps> = ({ownResource,userResource}) => {
  return (
      <>
          {ownResource ? <div className='flex flex-col gap-0.5 bg-white p-2 rounded '>
              <div className='flex flex-row items-center w-full justify-between'>
                  {ownResource.isPublic ? <GiPublicSpeaker size={18} /> : <AiFillLock size={18} />}
                  {ownResource.isPublic ? <span className='text-md font-semibold'>Public</span> : <span className='text-md font-semibold'>Private</span>}
                  <ResourceSetting resource={ownResource} />
                  
              </div>
              <Link className='lg:text-base xs:text-sm font-semibold' href={`/resource/${ownResource.id}`}>{ownResource.title}</Link>
              <span className='lg:text-sm xs:text-xs font-medium xs:truncate lg:whitespace-normal lg:line-clamp-2'>{ownResource.description}</span>
              <div className='flex flex-row items-center gap-4'>
                  <div className='flex flex-row gap-1 items-center'>
                      <span className='p-2 rounded-full bg-green-500 '><BiSolidLike size={20} /></span>
                      {ownResource?.likes?.length}

                  </div>
                  <div className='flex flex-row gap-1 items-center'>
                      <span className='p-2 rounded-full bg-red-500  '><BiSolidDislike size={20} /></span>
                      {ownResource?.dislikes?.length}

                  </div>
              </div>
          </div> :  userResource && <div className='flex flex-col gap-0.5 bg-white p-2 rounded'>
              <div className='flex flex-row items-center w-full justify-between'>
                  {userResource.isPublic ? <GiPublicSpeaker size={18} /> : <AiFillLock size={18} />}
                      {userResource.isPublic ? <span className='text-md font-semibold'>Public</span> : <span className='text-md font-semibold'>Private</span>}
                      <button className='bg-red-500 p-2 rounded-full ' onClick={()=>DeleteResource(userResource.id)}><MdDelete size={18} /></button>
                      
                  </div>
                  <Link className='lg:text-base xs:text-sm font-semibold' href={`/resource/${userResource.id}`}>{userResource.title}</Link>
                  <span className='lg:text-sm xs:text-xs font-medium xs:truncate lg:whitespace-normal lg:line-clamp-2'>{userResource.description}</span>
                  <div className='flex flex-row items-center gap-4 w-full'>
                      <span className='flex flex-row items-center gap-1'>
                          <button className='p-2 rounded-full bg-green-500 ' onClick={()=>LikeByResourceId(userResource.id)}><BiSolidLike size={20} /></button>
                            
                          
                      </span>
                      <span className='flex flex-row items-center gap-1'>
                          <button className='p-2 rounded-full bg-red-500 ' onClick={()=>DislikeByResourceId(userResource.id)}><BiSolidDislike size={20} /></button>
                            
                          
                      </span>
                  </div>
                  
          </div>}
  
      </>
  )
}

export default ResourceSideBarItem

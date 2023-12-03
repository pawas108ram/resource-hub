'use client'
import Heading from '@/components/Heading'
import SubHeading from '@/components/SubHeading'
import React, { useEffect, useState } from 'react'

import ResourceSideBarItem from './ResourceSideBarItem';
import { FullResourceType } from '../layout';
import { pusherClient } from '@/app/libs/pusher';
interface ResourceSideBarProps {
    ownResources: FullResourceType[];
    userResources: FullResourceType[];
}

const ResourceSideBar:React.FC<ResourceSideBarProps> = ({ownResources,userResources}) => {
    const [searchTitle, setSearchTitle] = useState('');
    const [filterOwnResources, setFilterOwnResources] = useState<FullResourceType[]>(ownResources);
    const [filterUserResources, setFilterUserResources] = useState<FullResourceType[]>(userResources);
    useEffect(() => {
        if (searchTitle === '') {
            setFilterOwnResources(ownResources);
            setFilterUserResources(userResources);
        } else {
            setFilterOwnResources(prevOwnResources =>
                prevOwnResources.filter(resource =>
                    resource.title!.toLowerCase().includes(searchTitle.toLowerCase())
                )
            );
            setFilterUserResources(prevUserResources =>
                prevUserResources.filter(resource =>
                    resource.title!.toLowerCase().includes(searchTitle.toLowerCase())
                )
            );
        }
    }, [searchTitle, ownResources, userResources]);
    useEffect(() => {
        pusherClient.subscribe('resource');
        pusherClient.bind('create:resource', (data: FullResourceType) => {
            setFilterOwnResources(prevUserResources => [...prevUserResources, data]);
        });
        pusherClient.bind('user:resource', (data: FullResourceType) => {
            setFilterUserResources(prevUserResources => [...prevUserResources, data]);
        });
        pusherClient.bind('delete:resource', (data: number) => {
            setFilterOwnResources(prevUserResources => prevUserResources.filter(resource => resource.id !== data));
            setFilterUserResources(prevUserResources => prevUserResources.filter(resource => resource.id !== data));

        });
        pusherClient.bind('update:resource', (data: FullResourceType) => {
            setFilterOwnResources((prev) => prev.map((resource) => resource.id === data.id ? data : resource));
            setFilterUserResources((prev) => prev.map((resource) => resource.id === data.id ? data : resource));
        })
        return () => {
            pusherClient.unsubscribe('resource');
            pusherClient.unbind('create:resource');
            pusherClient.unbind('delete:resource');
            pusherClient.unbind('update:resource');
            pusherClient.unbind('user:resource');
        }
    },[])
    

  return (
      <div className='flex flex-col gap-3 bg-black/80 p-4 w-72 h-screen overflow-y-auto lg:flex xs:hidden '>
          <Heading body='Search' className='text-gray-100 whitespace-nowrap' />
          <input type="text" name="search" id="search" className='form-input py-2 rounded placeholder:text-xs ' placeholder='Search By Resource Name' value={searchTitle} onChange={(e)=>setSearchTitle(e.target.value)} />
          <SubHeading body='My Resources' className='text-gray-100 whitespace-nowrap' />
          {filterOwnResources.length !== 0 ? <div className='flex flex-col gap-2 bg-black p-2 rounded w-full'>
              {filterOwnResources.map((resource) => (
                  <ResourceSideBarItem key={resource.id} ownResource={resource}  />
              ))}
          </div>:<span className='text-xl bg-black p-3 rounded text-white'>No Own Resources made yet </span>}
          <SubHeading body='User Resources' className='text-gray-100 whitespace-nowrap' />
          {filterUserResources.length !== 0 ? <div className='flex flex-col gap-2 bg-black p-2 rounded w-full'>
              {filterUserResources.map((resource) => (
                  <ResourceSideBarItem key={resource.id} userResource={resource}  />
              ))}
          </div>:<span className='text-xl bg-black p-3 rounded text-white'>No User Resources made yet </span>}

      
    </div>
  )
}

export default ResourceSideBar

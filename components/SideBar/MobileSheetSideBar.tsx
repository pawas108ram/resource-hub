'use client'
import { Resource, Sheet, User } from '@prisma/client'
import React, { Fragment, useEffect, useState} from 'react'
import { SiGooglesheets } from 'react-icons/si';
import {  Transition } from '@headlessui/react'
import { MdClose } from 'react-icons/md';
import {BiSolidToggleLeft,BiSolidToggleRight} from 'react-icons/bi'
import clsx from 'clsx';
import MobileSheetSideBarItem from './MobileSheetSideBarItem';
import SubHeading from '../SubHeading';


import Heading from '../Heading';
import {motion} from 'framer-motion'
import { FullResourceType, FullSheetType } from '@/app/(dashboard-layout)/resource/layout';



interface MobileSheetSideBarProps {
    ownSheets: FullSheetType[];
    ownResources: FullResourceType[];
    userSheets: FullSheetType[];
    userResources: FullResourceType[];
}


const MobileSheetSideBar: React.FC<MobileSheetSideBarProps> = ({ ownSheets, ownResources ,userSheets,userResources }) => {
    type ResourceType = 'RESOURCE' | 'SHEET';
   
    const [resource, setResource] = useState<ResourceType>('SHEET');
    const [open, setOpen] = useState(false);
    const [filterOwnSheets, setFilterOwnSheets] = useState<FullSheetType[]>(ownSheets);
    const [filterUserSheets, setFilterUserSheets] = useState<FullSheetType[]>(userSheets);
    const [filterUserResources, setFilterUserResources] = useState<FullResourceType[]>(userResources);
    const [filterOwnResources, setFilterOwnResources] = useState<FullResourceType[]>(ownResources);
    
  
   
    const toggleResource = () => {
        if (resource === 'SHEET') {
            setResource('RESOURCE');
        } else {
            setResource('SHEET');
        }
    }
    const [searchTitle, setSearchTitle] = useState('');
    useEffect(() => {
        
      

        if (searchTitle.length === 0) {
            setFilterOwnSheets(ownSheets);
            setFilterUserSheets(userSheets);
            setFilterOwnResources(ownResources);
            setFilterUserResources(userResources);
            
        }
        setFilterOwnSheets(() => ownSheets.filter((sheet) => sheet?.title?.toLowerCase().includes(searchTitle.toLowerCase())));
        setFilterUserSheets(() => userSheets.filter((sheet) => sheet?.title?.toLowerCase().includes(searchTitle.toLowerCase())));
        setFilterOwnResources(() => ownResources.filter((resource) => resource?.title?.toLowerCase().includes(searchTitle.toLowerCase())));
        setFilterUserResources(() => userResources.filter((resource) => resource?.title?.toLowerCase().includes(searchTitle.toLowerCase())));

        
    },[userResources,userSheets,ownResources,ownSheets,searchTitle])

    
    
  return (
      <div className=' w-full lg:hidden xs:flex top-0 sticky bg-black/20 z-50'>
          {!open && <div className='flex flex-row items-center bg-black/90 justify-around py-2 px-4 rounded w-screen gap-3 cursor-pointer ' >
              <button className='bg-gray-200 p-3 rounded-full' onClick={() => setOpen(true)}><SiGooglesheets size={28} /></button>
              <span className='text-white text-2xl font-semibold py-2 px-6 rounded bg-black/30'>ResourceHub</span>
          </div>}
          { <motion.div  className='xs:pb-32' animate={open ? "open" : "close"} variants={{
              open: { display:'flex'  ,opacity:1 },
              close: { display:'none',opacity:0, }
          }} transition={{duration:1}}>
                  <>
                  
                          
                          <div className='flex flex-col p-2 fixed inset-0 bg-black/80 z-[99999] gap-4 w-full  '>
                              <div>
                                  <div className='flex flex-row items-center p-4    gap-6 sticky top-0 z-[9999]'>
                                      <button className='bg-red-500/90 rounded-full p-3 text-white' onClick={()=>setOpen(false)}><MdClose size={20} /></button>
                                      <div className='flex flex-row items-center gap-2 text-white bg-black/80 rounded p-4 justify-around w-full' >
                                          <span className={clsx(resource==='SHEET'?'text-green-600 font-semibold text-lg':'text-gray-400 font-medium text-sm')}>Sheet</span>
                                          <span className='text-green-500 cursor-pointer ' onClick={()=>toggleResource()}>{resource === 'SHEET' ? <BiSolidToggleLeft size={36} /> : <BiSolidToggleRight size={36} />}</span>
                                          <span className={clsx(resource==='SHEET'?'text-gray-400 font-medium text-sm':'text-green-600 font-semibold text-lg')}>Resource</span>
                                      </div>
                  
                                  </div>
                                  <Heading body='Search' className='text-green-600 p-3 bg-black rounded w-full inline-block text-center' />
                    <div className="flex flex-row gap-2 items-center py-4 justify-center  ">
                        <input type="text" name="search" id="search" className='bg-gray-50 p-3 rounded w-4/5 ' placeholder='Search Sheets' onChange={(e) => setSearchTitle(e.target.value)} />
                  
                    </div>
                  
                                      {(filterOwnSheets.length > 0 || filterUserResources.length>0 || filterUserSheets.length>0 || filterOwnResources.length > 0) && <div className='flex flex-col gap-2 bg-white w-5/6 p-2 rounded items-center mx-auto overflow-scroll max-h-[400px]   '>
                                          {resource === 'SHEET' && <div className='flex flex-col gap-4 w-full'>
                                              {filterOwnSheets.length > 0 && <div className='flex flex-col gap-4 items-center'>
                                                  <SubHeading body='Own Sheets' />
                                                  <div className='flex flex-col gap-2 p-3 bg-black/80 w-full  '>
                                                        {filterOwnSheets.map((sheet) => {
                                                            return <MobileSheetSideBarItem key={sheet.id} sheet={sheet} />
                                                        })}
                                                    </div>
                  
                  
                                              </div>}
                                              {filterUserSheets.length > 0 && <div className='flex flex-col gap-4 items-center '>
                                                  <SubHeading body='User Sheets' />
                                                  <div className='flex flex-col gap-2 p-3 bg-black/80 w-full '>
                                                      {filterUserSheets.map((sheet) => {
                                                          return <MobileSheetSideBarItem key={sheet.id} usersheet={sheet} />
                                                      })}
                                                  </div>
                                              </div>}
                                          </div>}
                                          {resource === 'RESOURCE' && <div className='flex flex-col gap-4 w-full'>
                                              {filterOwnResources.length > 0 && <div className='flex flex-col gap-4 items-center'>
                                                  <SubHeading body='Own Resources' />
                                                  <div className='flex flex-col gap-2 p-3 bg-black/80 w-full'>
                                                        {filterOwnResources.map((resource) => {
                                                            return <MobileSheetSideBarItem key={resource.id} resource={resource} />
                                                        })}
                                                    </div>
                  
                  
                                              </div>}
                                              {filterUserResources.length > 0 && <div className='flex flex-col gap-4 items-center'>
                                                  <SubHeading body='User Resources' />
                                                  <div className='flex flex-col gap-2 p-3 bg-black/80 w-full '>
                                                      {filterUserResources.map((resource) => {
                                                          return <MobileSheetSideBarItem key={resource.id} userresource={resource} />
                                                      })}
                                                  </div>
                                              </div>}
                                          </div>}
                  
                                      </div> }
                  
                  
                              </div>
                          </div>
                          
                  
                  
                  </>
              </motion.div>}
      
    </div>
  )
}

export default MobileSheetSideBar

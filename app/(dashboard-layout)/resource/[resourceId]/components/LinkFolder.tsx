'use client'
import { FileLinks, ImageLinks, QuestionLinks, VideoLinks, WebsiteLinks } from '@prisma/client'
import React, { useState } from 'react'
import { LinkType } from './TaskModal';
import Content from '@/components/Content';
import { FaChevronCircleDown, FaChevronCircleUp } from 'react-icons/fa';
import clsx from 'clsx';
import Link from 'next/link';
import { MdDelete, MdEdit } from 'react-icons/md';
import {motion} from 'framer-motion'
interface LinkFolderProps {
    data: QuestionLinks[] | ImageLinks[] | FileLinks[] | VideoLinks[] | WebsiteLinks[];
    folderTitle: string;
    variant: LinkType;
}
    

const LinkFolder: React.FC<LinkFolderProps> = ({ data, folderTitle, variant }) => {
    const [showLinkContent, setShowLinkContent] =useState(false);
  return (
      <div className='flex flex-col bg-white lg:p-1 xs:p-0.5 rounded gap-1 text-black '>
          <div className='flex flex-row items-center justify-between p-1'>
              <Content body={folderTitle} className='underline xs:text-sm lg:text-lg' />
              <button className={clsx('p-3 rounded-full text-white ',showLinkContent?'bg-red-500 ':'bg-green-500')} onClick={()=>setShowLinkContent((prev)=>!prev)}>{showLinkContent ? <FaChevronCircleUp /> : <FaChevronCircleDown />}</button>
          </div>
          {<motion.div animate={showLinkContent ? 'show' : 'hide'} variants={{
              show: {
                    opacity: 1,
                    scaleY: 1,
                    
                    transition: {
                        duration: 0.3
                    }
                    ,
                    display: 'flex'
              },
                hide: {
                        opacity: 0,
                        scaleY: 0,
                        
                        display: 'none',
                        transition: {
                            duration: 0.3
                        }
              }
          }} className='flex flex-col gap-1 bg-black/90 rounded'>
                {data && data.length!==0 ? data.map((link, index) => {
                    return (
                        <div key={`link-${index}`} className='flex flex-row items-center justify-between p-0.5 '>
                            <Link className='text-blue-500 font-medium underline xs:text-xs lg:text-sm' href={link.link} >{link.title}</Link>
                           

                        </div>
                    )
                }):<span className='bg-black/90 text-white rounded lg:p-2 xs:text-sm lg:text-xl xs:p-0.5 w-full'>No Links Added</span>}
          </motion.div>}
    </div>
  )
}

export default LinkFolder

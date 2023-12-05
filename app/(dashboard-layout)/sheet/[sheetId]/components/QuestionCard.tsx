'use client'

import { Question, QuestionStatus } from '@prisma/client'
import clsx from 'clsx';
import React, { ChangeEventHandler, MouseEventHandler, useDeferredValue, useEffect, useState } from 'react'
import { MdClose, MdComment, MdSettings } from 'react-icons/md';
import {motion} from 'framer-motion'
import SubHeading from '@/components/SubHeading';
import { DeleteQuestion } from '@/app/_actions/DeleteQuestion';
import Link from 'next/link';
import { AiOutlineSolution } from 'react-icons/ai';
import QuestionEditModal from '@/components/modals/QuestionEditModal';
import { FullQuestionType } from '@/app/(dashboard-layout)/question/[sheetId]/[questionId]/page';


export const handleStatusBackGroundColor = (status: QuestionStatus) => {
    switch (status) {
        case "UNATTEMPTED":
            return 'bg-red-500';
        case "REVISED":
            return 'bg-orange-500';
        case "SOLVED":
            return 'bg-green-500';
        case "SKIPPED":
            return 'bg-blue-500';
        default:
            return 'bg-red-500';
    }
}

const QuestionCard = ({ question ,sheetId,isAuthor}: { question: FullQuestionType,sheetId:number,isAuthor:boolean }) => {
 
   const [status, setStatus] = useState<QuestionStatus>(question?.questionStatus[0]?.status || 'UNATTEMPTED');
   
    const [settingModal, setSettingModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    

    

    const handleStatusColor = (status: QuestionStatus) => {
        switch (status) {
            case "UNATTEMPTED":
                return 'text-red-500';
            case "REVISED":
                return 'text-orange-500';
            case "SOLVED":
                return 'text-green-500';
            case "SKIPPED":
                return 'text-blue-500';
            default:
                return 'text-red-500';
        }
    }
    
    
    return (
        <>
            {editModal && <QuestionEditModal onClose={() => setEditModal(false)} question={question} />}
            <div className={clsx(' p-1 flex flex-col lg:gap-2 xs:gap-1 rounded text-white bg-white/10') }>
                <div className='flex flex-row items-center gap-4 px-2 '>
                    <Link href={`/question/${sheetId}/${question.id}`} className='lg:text-lg border-b-[3px] border-white p-1  truncatestyle-1 flex-1 xs:text-sm '><button>{question.title}</button></Link>
            
                </div>
              <div className='flex flex-row items-center gap-4 w-full justify-around'>
            
            
                    <span className={clsx(' py-1 lg:px-4  rounded  text-center text-white font-semibold text-sm w-1/3 xs:px-2 xs:text-xs lg:text-sm ', handleStatusBackGroundColor(status))} >{status}</span>
                    <span className={clsx(' py-1 lg:px-4  rounded bg-black/90 text-white  text-center font-semibold text-sm w-1/3 xs:px-2 xs:text-xs lg:text-sm ')} >{question.difficulty}</span>
                    
            
            
                  
                    {isAuthor && <div className='relative'>
                        <button className='bg-white p-2 rounded-full text-black font-semibold' onClick={() => setSettingModal((prev) => !prev)}>{settingModal ? <MdClose size={20} /> : <MdSettings size={20} />}</button>
                        {settingModal && <motion.div animate={settingModal ? 'open' : 'close'} variants={{
                            open: { opacity: 1, translateX: '-30%' },
                            close: { opacity: 0, translateX: '0%' },
                        }} transition={{ duration: 0.3 }} className='absolute  bg-gray-800/90 rounded lg:top-0 xs:-top-10 -right-2 w-40 z-40 origin-left  p-4 flex flex-col gap-3'>
                            <SubHeading body='Settings' />
                            <button className='bg-green-500 py-1 px-3 rounded text-white font-semibold' onClick={()=>setEditModal(true)} >Edit</button>
                            <button className='bg-red-500 py-1 px-3 rounded text-white font-semibold' onClick={() => DeleteQuestion(question.id)}>Delete</button>
                        </motion.div>}
                    </div>}
              </div>
              <span className='self-center text-xl font-bold underline leading-4 xs:text-sm lg:text-lg'>Topic Tags</span>
              <div className='flex flex-row items-center gap-4 justify-center'>
                  {question.tags.slice(0, 4).map((tag) => (
                        <span className='bg-gray-200 py-1 lg:px-4 text-black rounded xs:text-xs lg:text-sm xs:px-2' key={tag}>{tag}</span>
                    ))}
            
                </div>
            
              </div>
        </>
     
  )
}

export default QuestionCard

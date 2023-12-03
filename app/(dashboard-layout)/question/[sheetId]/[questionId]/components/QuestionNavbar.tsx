'use client'
import useQuestionNavbarRoutes from '@/app/hooks/useQuestionNavbarRoutes'
import React, { useState } from 'react'
import QuestionNavbarElement from './QuestionNavbarElement';

import { FaPlus } from 'react-icons/fa';
import { Tooltip } from '@mui/material';
import SolutionCreationModal from '@/components/modals/SolutionCreationModal';
import { useRouter } from 'next/navigation';
import { RiArrowGoBackLine } from 'react-icons/ri';

const QuestionNavbar = ({questionId,sheetId}:{questionId:number,sheetId:string}) => {
  const questionRoutes = useQuestionNavbarRoutes(questionId,sheetId);
  const [createSolutionModal, setcreateSolutionModal] = useState(false);
  const router=useRouter();
  return (
    <div className='p-4 bg-white/40 rounded flex flex-row items-center gap-6 justify-center w-full'>
      <Tooltip title={ `Go Back to Sheet ${sheetId}`} placement='left-start'><button onClick={()=>router.push(`/sheet/${sheetId}`)} className='bg-gray-400 p-3 rounded-full text-white'><RiArrowGoBackLine /></button></Tooltip>
      {questionRoutes.map((navele) => (
        <QuestionNavbarElement key={navele.label} label={navele.label} href={navele.href} isActive={navele.isActive} icon={navele.icon}/>
      ))}
      <Tooltip title='Create Solution' placement='bottom-end'><button className='bg-green-500 text-white p-2 shadow shadow-black/40 rounded-full xs:flex lg:hidden' onClick={() => setcreateSolutionModal(true)}><FaPlus size={20} /></button></Tooltip>
      {createSolutionModal && <SolutionCreationModal onClose={()=>setcreateSolutionModal(false)} questionId={questionId} />}
      
      
      
    </div>
  )
}

export default QuestionNavbar

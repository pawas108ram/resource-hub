'use client'
import React, { useDeferredValue, useEffect, useState } from 'react'
import { FullQuestionType } from '../page'
import { QuestionStatus } from '@prisma/client'
import Select from 'react-select';
import { questionStatus } from '../../../../../libs/const/questionStatus';
import clsx from 'clsx';
import toast from 'react-hot-toast';

const QuestionStatusManager = ({ question }: { question: FullQuestionType }) => {
  const [status, setStatus] = useState<QuestionStatus>(question?.questionStatus[0]?.status || 'UNATTEMPTED');
  
  useEffect(() => {
    const updateStatus = async () => {
      const res = await fetch(`/api/questions/question/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status,questionId:question.id })
      })
     
      
    }
    updateStatus();
    
  }, [status, question.id])
  
  const statusColorManager = (status: QuestionStatus) => {
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
    <div className='flex lg:flex-row items-center lg:gap-4 justify-center w-full xs:flex-col xs:gap-0.5'>
      <span className={clsx('lg:text-lg xs:text-sm font-medium transition-colors duration-500 ease-in-out bg-gray-700/80 rounded py-1 px-3',statusColorManager(status))}>Status : {status}</span>
      <select name="status" id="status" className='py-2 lg:px-4 xs:px-2  text-black w-48 ' value={status} onChange={(e) => setStatus(e.currentTarget.value as QuestionStatus)} >
                          {questionStatus.map((status) => (
                                <option style={{color:status.color}} value={status.value} key={status.value}>{status.label}</option>
                            ))}
                     </select>
      
    </div>
  )
}

export default QuestionStatusManager

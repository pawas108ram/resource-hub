'use client'
import React, { useState } from 'react'
import { FullQuestionType } from '../page'
import { MdDelete, MdEdit } from 'react-icons/md'
import QuestionEditModal from '@/components/modals/QuestionEditModal'
import { DeleteQuestion } from '@/app/_actions/DeleteQuestion'
import { useRouter } from 'next/navigation'

const EditQuestionComponent = ({ question,sheetId }: { question: FullQuestionType ,sheetId:string}) => {
  const [editModal, seteditModal] = useState(false);
  const router = useRouter();
  return (
      <>
          {editModal && <QuestionEditModal onClose={() => seteditModal(false)} question={question} />}
          <div className="flex flex-row gap-4 items-center self-start">
              <button className='flex flex-row gap-2 items-center py-2 px-4 bg-black text-white  rounded' onClick={()=>seteditModal(true)}>
                  <MdEdit size={20} />
                    <span className='xs:sr-only lg:flex lg:not-sr-only'>Edit Question</span>
              </button>
              <button className='flex flex-row items-center gap-2 py-2 px-4 bg-red-500 text-white rounded '>
                  <MdDelete size={20} />
          <span className='xs:sr-only lg:flex lg:not-sr-only' onClick={async() => {
            DeleteQuestion(question.id).finally(()=>router.push(`/sheet/${sheetId}`))
          }
          }>Delete Question</span>
              </button>
          </div>
      
    </>
  )
}

export default EditQuestionComponent

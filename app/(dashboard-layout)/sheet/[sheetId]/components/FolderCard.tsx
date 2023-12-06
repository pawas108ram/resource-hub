'use client'
import { dateString } from '@/app/libs/utility functions/dateString';
import { Folder, Question, QuestionTag } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import { MdAdd, MdArrowDownward, MdArrowUpward, MdClose, MdSettings } from 'react-icons/md';
import QuestionCreation from './QuestionCreation';
import QuestionCard from './QuestionCard';
import clsx from 'clsx';
import {motion} from 'framer-motion'
import SubHeading from '@/components/SubHeading';
import { DeleteFolder } from '@/app/_actions/DeleteFolder';
import FolderEditingModal from './FolderEditingModal';
import { FullQuestionType } from '@/app/(dashboard-layout)/question/[sheetId]/[questionId]/page';
import { pusherClient } from '@/app/libs/pusher';
interface FolderCardProps{
    folder: Folder & {
        questions: FullQuestionType[],
    };
    sheetId: number;
    isAuthor: boolean;
    question: FullQuestionType[];
    searchTitle: string;
    tags: { value: QuestionTag, label: string }[] | null;
}



const FolderCard: React.FC<FolderCardProps> = ({ folder, sheetId, isAuthor, question, searchTitle, tags }) => {
    const [showQuestions, setShowQuestions] = useState(false);
    const [settingModal, setSettingModal] = useState(false);
    const [editingModal, setEditingModal] = useState(false);
    const [filterQuestions, setFilterQuestions] = useState<FullQuestionType[]>([]);
    useEffect(() => {
        if (searchTitle === '') {
            setFilterQuestions(folder.questions);
        }
        if (tags !== null && tags.length !== 0 && searchTitle !== '') {
            setFilterQuestions(folder.questions.filter((question) => question.title.toLowerCase().includes(searchTitle.toLowerCase()) && question.tags.some((tag) => tags.some((tag1) => tag1.value === tag))))
            

        }
        else if (tags !== null && tags.length !== 0) {
            setFilterQuestions(folder.questions.filter((question) => question.tags.some((tag) => tags.some((tag1) => tag1.value === tag))))
        }
        else if (searchTitle !== '') {
            setFilterQuestions(folder.questions.filter((question) => question.title.toLowerCase().includes(searchTitle.toLowerCase())))
        }
        else {
            setFilterQuestions(folder.questions.filter((question) => question.title.toLowerCase().includes(searchTitle.toLowerCase())))
        }
        pusherClient.subscribe('question');
        pusherClient.bind('delete:folderquestion', (data: number) => {
            setFilterQuestions(prevQuestions => prevQuestions.filter(question => question.id !== data));
        });
        pusherClient.bind('create:folderquestion', (data: FullQuestionType) => {
            setFilterQuestions(prevQuestions => [...prevQuestions, data]);
        });
        pusherClient.bind('update:question', (data: FullQuestionType) => {
            setFilterQuestions(prevQuestions => prevQuestions.map(question => question.id === data.id ? data : question));
        });
        return () => {
            pusherClient.unsubscribe('question');
            pusherClient.unbind('delete:folderquestion');
            pusherClient.unbind('create:folderquestion');
            pusherClient.unbind('update:question');
        }
    }, [searchTitle, folder.questions,tags]);
            
    return (
      
        <>
            {editingModal && <FolderEditingModal folder={folder} onClose={() => setEditingModal((prev) => !prev)} question={question} />}
          <div className='flex flex-col  py-2 px-3 bg-black text-white rounded gap-3 items-start'>
              <div className="flex flex-row  justify-between py-1 px-4 w-full">
                  <span className='text-2xl border-b-[3px] border-white p-1 truncate'>{folder.title}</span>
          
                  <div className="flex flex-row items-center gap-4">
                      <button className='bg-gray-400 p-2 rounded-full text-black font-semibold' onClick={() => setShowQuestions((prev)=>!prev)}>{showQuestions ? <MdArrowUpward size={20} /> : <MdArrowDownward size={20} />}</button>
                        {isAuthor && <button ><QuestionCreation folderId={folder.id} sheetId={sheetId} /></button>}
                        {isAuthor && <div className="relative">
                            <button className='bg-white p-2 rounded-full text-black font-semibold' onClick={() => setSettingModal((prev) => !prev)} >{settingModal ? <MdClose size={20} /> : <MdSettings size={20} />}</button>
                            {settingModal && <motion.div animate={settingModal ? 'open' : 'close'} variants={{
                                open: { opacity: 1, translateX: '-30%' },
                                close: { opacity: 0, translateX: '-0%' },
                            }} transition={{ duration: 0.3 }} className='absolute bg-gray-800/90 rounded lg:top-0 xs:-top-10 -right-2 w-40 z-40 origin-left  p-4 flex flex-col gap-3'>
                                <SubHeading body='Settings' />
                                <button className='bg-green-500 py-1 px-3 rounded text-white font-semibold' onClick={() => setEditingModal(true)}>Edit</button>
                                <button className='bg-red-500 py-1 px-3 rounded text-white font-semibold' onClick={() => DeleteFolder(folder.id)}>Delete</button>
                            </motion.div>}
                        </div>}
                  </div>
          
          
              </div>
              <div className='flex lg:flex-row items-center lg:gap-4 bg-white/10 py-1 px-4 text-white xs:flex-col xs:gap-0.5 rounded text-xs '>
                      <span>Created: { dateString(new Date(folder.createdAt)) }</span>
                      <span>Updated: { dateString(new Date(folder.updatedAt)) }</span>
              </div>
          
               <motion.div animate={showQuestions ? 'open' : 'closed'} variants={
                  {
                      open: { opacity: 1, scaleY:1 ,display:'flex' },
                        closed: { opacity: 0, scaleY:0 ,display:'none'}
                  }
              } transition={{ duration: 0.5 }} className={clsx('flex flex-col lg:gap-2 xs:gap-1 w-full ')} >
                  <div className='bg-white text-black text-sm p-2 rounded flex flex-col gap-1 '>
                      <SubHeading body='Description'  className='underline xs:text-base lg:text-2xl'/>
                      <span className='xs:text-sm lg:text-base'>{folder.description}</span>
                  </div>
                  {filterQuestions!==undefined && filterQuestions.length!==0 ?(filterQuestions.map((question) => {
                      return <QuestionCard key={question.id} question={question} sheetId={sheetId} isAuthor={isAuthor} />
                  })):(<span className='text-center text-gray-400'>No Questions in this Folder</span>)}
              </motion.div>
              
              </div>
      </>
  )
}

export default FolderCard

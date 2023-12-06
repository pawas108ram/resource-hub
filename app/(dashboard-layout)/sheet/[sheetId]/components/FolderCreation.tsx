'use client'
import Content from '@/components/Content';

import SubHeading from '@/components/SubHeading';
import Button from '@/components/buttons/Button';
import { Difficulty, Question, QuestionTag } from '@prisma/client';

import React, { useEffect, useState } from 'react'

import toast from 'react-hot-toast';
import { MdAdd, MdClose } from 'react-icons/md';

import Select from 'react-select'
import { topics } from '@/app/libs/const/questionTag'
import { difficulties } from '@/app/libs/const/difficulty';
import { SingleSheetPage } from '../page';
        

const FolderCreationModal = ({ onClose ,sheet}: { onClose: () => void ,sheet:SingleSheetPage}) => {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [questions, setQuestions] = useState<{value:number,label:string}[]>([]);
    const [selectedQuestion, setSelectedQuestions] = useState<{ value: number, label: string }[] >([]);
   
    
    useEffect(() => {
        const fetchQuestions = async () => {
            const res = await fetch(`/api/questions/${sheet.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((res) => res.json());
            setQuestions(res.map((question:Question) => {
                return { value: question.id, label: question.title }
            }))
        }
        fetchQuestions();
    },[sheet.id])
    
    
   
    
    
    
    
    

    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        

        setIsLoading(true);
        const body = {
            title,
            description,
            questions: selectedQuestion.map((question) => question.value  ),
            
            
            sheetId: sheet.id,
           
        }
        console.log(body);

        await fetch('/api/folders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)

        }).then((res) => {
            if (res.status === 200) {
                toast.success('Folder Added');
            }
            else {
                toast.error('Folder Could Not Added');
            }
        }).finally(() => {
            setIsLoading(false);
            onClose();
        });
    }

    const handleFolders = (e: any) => {
        setSelectedQuestions(e);
        console.log(selectedQuestion)
        

    }

 
    
    return <div className='fixed  bg-black/40 flex flex-row items-center justify-center z-[9999999] inset-0'>
        <div className='bg-black text-white  p-4 rounded xs:w-4/5 lg:w-2/5 relative flex flex-col gap-8 xs:h-3/5 lg:h-auto lg:overflow-visible xs:overflow-hidden  '>
            <button className='absolute lg:-right-5 lg:-top-5 bg-red-600 p-3 rounded-full xs:top-2 xs:right-2 ' onClick={onClose}><MdClose /></button>
            <SubHeading body='Create Folders for Question' />
            <form className='flex flex-col gap-4 h-full overflow-hidden ' onSubmit={handleSubmit}>
                <div className="flex flex-col gap-3 h-full overflow-y-auto ">
                    <label htmlFor="title" className='text-2xl font-bold'>Title</label>
                    <input type="text" name="title" id="title" placeholder='Enter title for Folder...' className='form-input rounded bg-white/10 text-blue-600' disabled={isLoading} onChange={(e)=>setTitle(e.target.value)} value={title} />
                    <label htmlFor="description" className='text-2xl font-bold '>Description</label>
                    <textarea name="description" id="description" placeholder='Enter description for Folder...' className='form-textarea resize-none bg-white/10 text-blue-600 flex-shrink-0' disabled={isLoading} onChange={(e) => setDescription(e.target.value)} value={description} rows={5} cols={5} />
                    <label htmlFor="questions" className='text-2xl font-bold'>Select Questions to Add</label>
                    <Select placeholder="Select Questions" options={questions} className='basic-multi-select text-black' maxMenuHeight={150} isMulti onChange={(e)=>handleFolders(e)}/>


                </div>
                
                            <Button type='submit'>Add Question</Button>
            </form>

        </div>

    </div>
}

const FolderCreation = ({sheet}:{sheet:SingleSheetPage}) => {
    
    const [questionModal, setFolderModal] = useState(false);

    
    
  return (
      <>    {questionModal && <FolderCreationModal onClose={ ()=>setFolderModal(false)} sheet={sheet} />}
          <button className='bg-green-500   w-full outline-offset-2  p-4 rounded xs:p-2' onClick={()=>setFolderModal(true)}><Content body='Create Folder' className='xs:text-xs lg:text-lg '/></button>
      </>
  )
}

export default FolderCreation

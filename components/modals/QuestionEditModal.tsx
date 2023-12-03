'use client'
import { FullQuestionType } from '@/app/(dashboard-layout)/question/[sheetId]/[questionId]/page'
import React, { FormEvent, useState } from 'react'
import { MdAdd, MdClose } from 'react-icons/md'
import SubHeading from '../SubHeading'
import { Difficulty, QuestionTag } from '@prisma/client'
import Select from 'react-select'

import toast from 'react-hot-toast'
import { difficulties } from '@/app/libs/const/difficulty'
import { topics } from '@/app/libs/const/questionTag'
import Button from '../buttons/Button'
import { Tooltip } from '@mui/material'
import LinkComponent from '../LinkComponent'


const QuestionEditModal = ({ onClose, question }: { onClose: () => void, question: FullQuestionType }) => {
    const [title, setTitle] = useState<string>(question.title);
    const [links, setLinks] = useState<string[]>(question.links);
    const [tags, setTags] = useState<{ label: string, value: string }[]>(question.tags.map((tag) => ({ label: tag, value: tag })));
    const [difficulty, setDifficulty] = useState<{ label: string, value: string }>({ label: question.difficulty, value: question.difficulty });
    const [isLoading, setIsLoading] = useState(false);
    const [link, setLink] = useState<string>('');
    const [showLink,setShowLink] = useState<boolean>(false);
    const AddLink = () => {
        if (links.includes(link)) {
            setLink('');
            toast.error('Link Already Exists');
            return;
        }
        if(link=='')return;

        setLinks([...links,link]);
        setLink('');
        toast.success('Link Added');
        
    }
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const body = {
            title,
            links,
            tags: tags.map((tag) => tag.value as QuestionTag),
            difficulty: difficulty.value as Difficulty,
            questionId: question.id

        };
        setIsLoading(true);
        const res = await fetch('/api/questions/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        }).then((res) => {
            if (res.status === 200) {
                toast.success('Question Updated Successfully');
            }
            else {
                toast.error('Something went wrong');
            }
        }).finally(() => {
            setIsLoading(false);
        });
    }
  return (
      <div className='fixed inset-0 bg-black/60 z-[99999] flex flex-row items-center justify-center'>
          <form className='bg-black text-white  p-4 rounded lg:w-3/5 xs:w-5/6 relative flex flex-col gap-2 ' onSubmit={(e)=>handleSubmit(e)}>
              <button className='bg-red-500 rounded-full p-3 -top-5 -right-5 absolute' onClick={() => onClose()}><MdClose /></button>
              <SubHeading body='Edit Question' className=' border-b-4 border-white w-full' />
              <label className=' text-2xl font-semibold'>Title</label>
              <input type='text' className='text-blue-500 bg-white/10 border-gray-900 rounded  form-input xs:text-xs lg:text-base' value={title} onChange={(e) => setTitle(e.target.value)} />
              <label htmlFor="link" className='text-2xl font-bold '>Question Links</label>
              <div className="flex flex-row items-center gap-4">
                        <input type="text" name="link" id="link" placeholder='Enter the Links for the Question...' onChange={(e)=>setLink(e.target.value)} value={link} className='form-input rounded flex-1 w-4/5 xs:text-xs text-blue-500 bg-white/10 p-3' disabled={isLoading} />
                  <button className='bg-blue-500 p-3 rounded-full hover:scale-105 hover:bg-blue-600 transition duration-300' type='button' onClick={() => AddLink()}><MdAdd/></button>

                    </div>
                    <div className='  flex flex-row items-center gap-2 justify-center  '>
                        {links?.map((link,ind) => (
                            <LinkComponent key={ `link-${ind}`} ind={ind} link={link}  setLinks={setLinks} />
                        ))}
              </div>
              <label className=' text-2xl font-semibold'>Difficulty</label>
              <Select options={difficulties} value={difficulty} className='basic-select text-black xs:text-xs lg:text-base' onChange={(e) => setDifficulty(e as any)} isDisabled={isLoading} maxMenuHeight={150} />
              <label className=' text-2xl font-semibold'>Tags</label>
              <Select options={topics} isMulti className='basic-multi-select text-black xs:text-xs lg:text-base' placeholder="Select Topic Tags" value={tags} onChange={(e) => setTags(e as any)} isDisabled={isLoading} maxMenuHeight={200} />
              <Button type='submit' >Update Question</Button>
             
              


          </form>
      
    </div>
  )
}

export default QuestionEditModal

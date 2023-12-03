'use client'
import Content from '@/components/Content';

import SubHeading from '@/components/SubHeading';
import Button from '@/components/buttons/Button';
import { Difficulty, Folder, QuestionTag } from '@prisma/client';

import React, { useState } from 'react'

import toast from 'react-hot-toast';
import { MdAdd, MdClose } from 'react-icons/md';

import Select from 'react-select'
import { topics } from '@/app/libs/const/questionTag'
import { difficulties } from '@/app/libs/const/difficulty';

        

const QuestionCreationModal = ({ onClose ,sheetId,folderId}: { onClose: () => void ,sheetId?:number,folderId?:number}) => {
    const [title, setTitle] = useState<string>('');
    const [links, setLinks] = useState<string[]>([]);
    const [link,setLink]=useState<string>('')
    const [tags, setTags] = useState<{label:string,value:string}[]>([]);
    const [difficulty, setDifficulty] = useState<{ label: string, value: string } | null>(null);
    
    
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
    function handleTag(data:any) {
       
        setTags(data);
        
    }

    function handleDifficulty(data:any) {
        setDifficulty(data);
        
    }
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async (e: any) => {
        e.preventDefault();

        setIsLoading(true);
        const body = {
            title,
            links,
            tags: tags.map((tag) => tag.value),
            difficulty: difficulty?.value as Difficulty,
            sheetId: sheetId,
            folderId:folderId
        }
        const res =await fetch('/api/questions/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)

        });
        const text = await res.text();
        
        if (res.ok) {
            toast.success(text);
            onClose();
            
        }
        else {
            toast.error(text);
        }
    }

 
    
    return <div className='fixed inset-0 bg-black/40 flex flex-row items-center justify-center z-[999999]'>
        <div className='bg-black  p-4 rounded xs:w-4/5 lg:w-2/5 relative flex flex-col gap-8 text-white lg:h-auto xs:h-3/5 xs:overflow-y-auto   '>
            <button className='absolute lg:-right-5 lg:-top-5 bg-red-600 p-3 rounded-full xs:top-2 xs:right-2' onClick={onClose}><MdClose /></button>
            <SubHeading body='Create Question' />
            <form className='flex flex-col gap-4 h-full overflow-hidden' onSubmit={handleSubmit}>
                <div className="flex flex-col gap-3 h-full overflow-y-auto">
                    <label htmlFor="title" className='text-2xl font-bold'>Title</label>
                    <input type="text" name="title" id="title" placeholder='Enter title for Question...' className='form-input rounded bg-white/10 text-blue-500' disabled={isLoading} onChange={(e)=>setTitle(e.target.value)} value={title} />
                    <label htmlFor="link" className='text-2xl font-bold'>Question Links</label>
                    <div className="flex flex-row items-center gap-4 w-full">
                        <input type="text" name="link" id="link" placeholder='Enter the Links for the Question...' onChange={(e)=>setLink(e.target.value)} value={link} className='form-input rounded flex-1 w-5/6 bg-white/10 text-blue-500' disabled={isLoading} />
                        <button className='bg-blue-500 p-3 rounded-full hover:scale-105 hover:bg-blue-600 transition duration-300' type='button' onClick={()=>AddLink()}><MdAdd/></button>

                    </div>
                    <span className='lg:text-sm xs:text-xs text-blue-500 text-center'>Click on the add button to add links</span>
                    <div className='truncate  flex flex-row items-center gap-2 flex-shrink-0 '>
                        {links?.map((link,ind) => (
                            <div key={`link/${ind}`} className='flex flex-row items-center gap-1 rounded bg-white/10 text-white p-2 text-xs '>
                                <span>{link}</span>
                                <button className='bg-red-500 p-1 rounded-full hover:scale-105 hover:bg-red-600 transition duration-300' type='button' onClick={()=>setLinks(links.filter((l)=>l!=link))}><MdClose/></button>
                            </div>
                        ))}
                    </div>
                    <label htmlFor="tags" className='text-2xl font-bold'>Tags</label>
                    <Select options={topics} isMulti className='basic-multi-select text-black' placeholder="Select Topic Tags" value={tags} onChange={(e) => handleTag(e)} isDisabled={isLoading} maxMenuHeight={200}/>
                    <label htmlFor="difficulty" className='text-2xl font-bold'>Difficulty</label>
                    <Select options={difficulties} placeholder="Select Difficulty " className='basic-select text-black' onChange={(e) => handleDifficulty(e)} isDisabled={isLoading} maxMenuHeight={150} />


                </div>
                
                            <Button type='submit'>Add Question</Button>
            </form>

        </div>

    </div>
}

const QuestionCreation = ({folderId,sheetId}:{folderId?:number,sheetId:number}) => {
    
    const [questionModal, setQuestionModal] = useState(false);

    
    
  return (
      <>    {questionModal && <QuestionCreationModal onClose={ ()=>setQuestionModal(false)} sheetId={sheetId} folderId={folderId}/>}
          {folderId === undefined ? <button className='bg-white text-black w-full outline-offset-2  p-4 rounded xs:p-2 ' onClick={()=>setQuestionModal(true)}><Content body='Create Question' className='xs:text-xs lg:text-lg '/></button>: <button className='bg-green-400 p-2 rounded-full text-black font-semibold' onClick={() => setQuestionModal(true)}><MdAdd size={20} /></button>}
      </>
  )
}

export default QuestionCreation

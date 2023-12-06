'use client'
import { accesstypes } from '@/app/libs/const/accesstypes';
import { programmingLanguages } from '@/app/libs/const/languages';
import React, { FormEvent, useState } from 'react'
import Select from 'react-select';
import {solutionTypes} from '@/app/libs/const/solutionType'
import Button from '@/components/buttons/Button';
import { AccessType, Complexity, Languages, SolutionType } from '@prisma/client';
import toast from 'react-hot-toast';
import TextareaAutosize from 'react-textarea-autosize';
import { complexities } from '@/app/libs/const/complexity';
import { resolve } from 'node:path/posix';


            


const CodeComponent = ({ questionId }: { questionId: number }) => {
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState<Languages>('Cpp');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<SolutionType>('BruteForce');
  const [shareMode, setShareMode] = useState<AccessType>('Public');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeComplexity, setTimeComplexity] = useState<{ value: Complexity, label: string }>({ value: 'Constant', label: 'Constant' });
  const [spaceComplexity, setSpaceComplexity] = useState<{ value: Complexity, label: string }>({ value: 'Constant', label: 'Constant' });

  const handleSubmit = async () => {
   
    setLoading(true);
    const body = {
      title,
      language,
      description,
      type,
      shareMode,
      code,
      questionId,
      timeComplexity: timeComplexity.value,
      spaceComplexity: spaceComplexity.value,

    };
    const res = await fetch('/api/solution', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).finally(() => {
      setLoading(false);
    });
    setTitle('');
    setDescription('');
    setCode('');
    setLanguage('Cpp');
    setType('BruteForce');
    setShareMode('Public');
    if (res.ok) {
      toast.success('Solution Created Successfully');
    }
    else {
      const errormessage = await res.text();
      toast.error(errormessage);
    }

    


    
  }


  

  return (
    <div className=" sticky top-0 flex flex-row lg:items-center xs:items-start justify-center h-full overflow-y-auto py-4 ">
      <div className="flex flex-col lg:h-full xs:h-5/6 gap-4 ">
        <div className='flex flex-col bg-white/20 gap-2 p-6 rounded text-white  overflow-y-auto  h-full ' >
          <label htmlFor='language' className='text-2xl font-bold tracking-wider' >Choose Language</label>
          <Select className='text-black' options={programmingLanguages} placeholder='Code Language' maxMenuHeight={300} onChange={(e) => setLanguage(e?.value as Languages)} isDisabled={loading} />
          <label htmlFor="title" className='text-2xl font-bold tracking-wider'>Title</label>
          <input type="text" name="title" id="title" className='form-input bg-black text-white rounded' placeholder='Enter a title for approach' onChange={(e) => setTitle(e.target.value)} disabled={loading} value={title} />
          <label htmlFor="Description" className='text-2xl font-bold tracking-wider'>Small explanation of Approach</label>
        
        
          <TextareaAutosize name="Description" id="Description" className='text-white bg-black p-2 form-textarea rounded resize-y min-h-[12rem]' placeholder='Enter Explanation for approach' minRows={40} onChange={(e) => setDescription(e.target.value)} disabled={loading} value={description} />
          <label htmlFor="complexity" className='text-2xl font-bold tracking-wider'>Complexity of the Approach</label>
          <div className='flex lg:flex-row xs:flex-col xs:gap-1 items-center bg-white/10 text-white p-2 rounded lg:gap-6'>
        
            <span className='flex flex-col gap-0.5 w-full '>
              <span className='xs:text-sm lg:text-lg'>Time Complexity</span>
              <Select placeholder='Time Complexity' options={complexities} className='text-black w-1/2 xs:w-full ' value={timeComplexity} maxMenuHeight={300} required onChange={(e: any) => setTimeComplexity(e)} isDisabled={loading} />
            </span>
            <span className="flex flex-col gap-0.5 w-full">
              <span className='xs:text-sm lg:text-lg'>Space Complexity</span>
              <Select className='w-1/2 xs:w-full ' options={complexities} placeholder='Space Complexity' value={spaceComplexity} maxMenuHeight={300} required onChange={(e: any) => setSpaceComplexity(e)} isDisabled={loading} /></span>
          </div>
          <label htmlFor="setting" className='text-2xl font-bold tracking-wider'>Approach Custom Setting</label>
          <div className='flex flex-row items-center bg-white/10 text-white p-2 rounded gap-6 xs:flex-col xs:gap-1'>
        
            <span className='flex flex-col gap-0.5 w-full'>
              <span className='xs:text-sm lg:text-lg'>Type of Approach</span>
              <Select placeholder='Type of Approach' options={solutionTypes} className='text-black w-1/2 xs:w-full ' maxMenuHeight={300} required onChange={(e) => setType(e?.value as SolutionType)} isDisabled={loading} /></span>
            <span className="flex flex-col gap-0.5 w-full">
              <span className='xs:text-sm lg:text-lg'>Share Mode</span>
              <Select className='w-1/2 xs:w-full ' options={accesstypes} placeholder='Share Mode' maxMenuHeight={300} required onChange={(e) => setShareMode(e?.value as AccessType)} isDisabled={loading} /></span>
          </div>
          <label htmlFor="code" className='text-2xl font-bold tracking-wider'>Code</label>
          <TextareaAutosize name="code" id="code" className='form-textarea  bg-black text-white  rounded  p-2 resize-y min-h-[12rem]' placeholder='Enter Code for approach' minRows={40} onChange={(e) => setCode(e.target.value)} disabled={loading} value={code} />
        
        
        
        
        </div>
        <button className='py-3 px-6 bg-blue-600 text-white text-lg font-semibold' onClick={() => handleSubmit()}>Create Solution</button>
      </div>
    </div>
  )
}

export default CodeComponent

import { Complexity, Languages, Solution, SolutionType } from '@prisma/client'
import React, { useState } from 'react'
import { MdClose } from 'react-icons/md'
import SubHeading from '../SubHeading'
import Select from 'react-select';
import { programmingLanguages } from '@/app/libs/const/languages';
import { complexities } from '@/app/libs/const/complexity';
import { TextareaAutosize } from '@mui/material';
import { accesstypes } from '@/app/libs/const/accesstypes';
import { solutionTypes } from '@/app/libs/const/solutionType';
import Button from '../buttons/Button';
import toast from 'react-hot-toast';


const EditSolutionModal = ({ onClose, sol }: { onClose: () => void, sol: Solution }) => {
    const [title, setTitle] = useState<string>(sol.title);
    const [body, setBody] = useState<string>(sol.body);
    const [language, setLanguage] = useState<{value:Languages,label:string}>({value:sol.language,label:sol.language});
    const [loading, setIsLoading] = useState(false);
    const [code, setCode] = useState<string>(sol.code);
   
    const [timeComplexity, setTimeComplexity] = useState<{value:Complexity ,label:string}>({value:sol.timeComplexity,label:sol.timeComplexity});
    const [spaceComplexity, setSpaceComplexity] = useState<{ value: Complexity, label: string }>({ value: sol.spaceComplexity, label: sol.spaceComplexity });
    const [type, setType] = useState<{ value: SolutionType, label: string }>({ value: sol.type, label: sol.type });
    const [accessType, setAccessType] = useState<{ value: string, label: string }>({ value: sol.accessType, label: sol.accessType });

    const handleClick = async() => {
        setIsLoading(true);
        const apiCallBody = {
            title,
            body,
            language: language.value,
            code,
            timeComplexity: timeComplexity.value,
            spaceComplexity: spaceComplexity.value,
            type: type.value,
            accessType: accessType.value,
            solutionId: sol.id
        };
       const res=await  fetch('/api/solution/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(apiCallBody),
       });
        if (res.ok) {
            toast.success('Solution Updated Successfully')
        }
        else {
            const text = await res.text();
            toast.error(text);
        }

        onClose();
    }
    
    
  return (
      <div className='bg-black/60 z-[99999] flex flex-row fixed inset-0 items-center justify-center h-screen'>
          <div className='bg-white p-3 rounded lg:w-3/5 xs:w-5/6 relative flex flex-col gap-2 text-black  lg:h-5/6 xs:h-3/5 '>
              <button className='bg-red-500 rounded-full p-3 -top-5 -right-5 absolute' onClick={() => onClose()}><MdClose /></button>
              <SubHeading body='Edit Solution' className='underline' />
              <div  className='flex flex-col gap-2 h-full overflow-y-scroll'>
                  <label htmlFor='language' className='text-2xl font-bold tracking-wider' >Choose Language</label>
                         <Select className='text-black' options={programmingLanguages} value={language} placeholder='Code Language' maxMenuHeight={300} onChange={(e:any)=>setLanguage(e)} isDisabled={loading} />
                        <label htmlFor="title" className='text-2xl font-bold tracking-wider'>Title</label>
                        <input type="text" name="title" id="title" className='form-input bg-black text-white rounded' placeholder='Enter a title for approach' onChange={(e)=>setTitle(e.target.value)} disabled={loading} value={title} />
                        <label htmlFor="Description" className='text-2xl font-bold tracking-wider'>Small explanation of Approach</label>
                        
                  
                        
                        <TextareaAutosize name="Description" id="Description" className='text-white bg-black p-2 form-textarea rounded resize-y min-h-[12rem]' placeholder='Enter Explanation for approach' minRows={40}   onChange={(e) => setBody(e.target.value)} disabled={ loading} value={body} />
                        <label htmlFor="complexity" className='text-2xl font-bold tracking-wider'>Complexity of the Approach</label>
                        <div className='flex flex-row items-center bg-white/60 text-black p-2 rounded gap-6'>
                         
                          <Select placeholder='Time Complexity' options={complexities} className='text-black w-1/2 ' value={timeComplexity} maxMenuHeight={300} required onChange={(e:any)=>setTimeComplexity(e)} isDisabled={loading} />
                          <Select className='w-1/2 ' options={complexities} placeholder='Space Complexity' value={spaceComplexity} maxMenuHeight={300} required onChange={(e:any) => setSpaceComplexity(e)} isDisabled={loading} />
                        </div>
                        <label htmlFor="setting" className='text-2xl font-bold tracking-wider'>Approach Custom Setting</label>
                  
                        <div className='flex flex-row items-center bg-white/60 text-black p-2 rounded gap-6'>
                      <Select placeholder='Type of Approach' options={solutionTypes} value={type} className='text-black w-1/2 ' maxMenuHeight={300} required onChange={(e:any) => setType(e)} isDisabled={loading} />
                      <Select className='w-1/2 ' options={accesstypes} placeholder='Share Mode' value={accessType}  maxMenuHeight={300} required onChange={(e:any) => setAccessType(e)} isDisabled={loading} />
                        </div>
                        <label htmlFor="code" className='text-2xl font-bold tracking-wider'>Code</label>
                  <TextareaAutosize name="code" id="code" className='form-textarea  bg-black text-white  rounded  p-2 resize-y min-h-[12rem]' placeholder='Enter Code for approach' minRows={40} onChange={(e) => setCode(e.target.value)} disabled={loading} value={code} />
                  
                  
              </div>
              <button className='bg-blue-600 py-3 px-6 font-semibold text-lg rounded-sm' onClick={()=>handleClick()}>Update Solution</button>
    

          </div>
      
    </div>
  )
}

export default EditSolutionModal

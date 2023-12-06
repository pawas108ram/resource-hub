'use client'
import { TextareaAutosize } from '@mui/material'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const QuestionCommentCreation = ({ questionId }: { questionId: string }) => {
    const [body, setBody] = useState<string>('')
    const handleCreate = async () => {
        const res = await fetch('/api/comment/question/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ questionId, body })
        });
        const text = await res.text();
        if (res.ok) {
            setBody('');
            toast.success(text);

        }
        else {
            console.log(text);
            toast.error(text);
        }
    }
    
  return (
      <div className='flex flex-col gap-3'>
           <TextareaAutosize className='w-full bg-white/10 text-white rounded p-2 form-textarea placeholder:text-white/80 resize-none' minRows={5} placeholder='Post your doubts and queries here' value={body} onChange={(e)=>setBody(e.target.value)} />
      <button className='py-2 px-4 ring-offset-1 rounded bg-blue-600 ring-1 ring-white self-start font-semibold text-white  ' onClick={()=>handleCreate()}>Start Discussion</button>
      </div>
  )
}

export default QuestionCommentCreation

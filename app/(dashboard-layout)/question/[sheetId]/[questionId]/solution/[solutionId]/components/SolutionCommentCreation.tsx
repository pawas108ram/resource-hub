'use client'
import { TextareaAutosize } from '@mui/material';
import { revalidateTag } from 'next/cache';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const SolutionCommentCreation = ({solutionId}:{solutionId:number}) => {
  const [commentBody, setCommentBody] = useState('');
  const handleSolutionComment = async () => {
    
    const res=await fetch('/api/solution/comment/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ solutionId, commentBody })
    });
  
    
    const text=await res.text();
    if (res.ok) {
      setCommentBody('')
      toast.success(text);

    }
    else {
      toast.error(text);
    }
    
  }
  return (
      <div className='flex flex-col lg:items-start xs:items-center gap-4'>
            <TextareaAutosize  className='w-full bg-white/20 rounded p-2 form-textarea placeholder:text-white/80 resize-none' minRows={5} placeholder='Add a comment' value={commentBody} onChange={(e)=>setCommentBody(e.target.value)} />
            <button className='bg-black/80 rounded p-2 whitespace-nowrap '  onClick={()=>handleSolutionComment()}>Post Comment</button>
      
    </div>
  )
}

export default SolutionCommentCreation

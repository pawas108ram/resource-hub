'use client'
import { SolutionCommentType } from '@/app/(dashboard-layout)/question/[sheetId]/[questionId]/solution/[solutionId]/page'

import React, { useState } from 'react'
import { MdClose } from 'react-icons/md'
import SubHeading from '../SubHeading'
import Content from '../Content'
import { TextareaAutosize } from '@mui/material'
import toast from 'react-hot-toast'

const CreateSolutionReplyModal = ({ onClose, parentComment }: { onClose: () => void, parentComment: SolutionCommentType }) => {
    const [body, setBody] = useState<string>('')
    const handleReply = async () => {
        const reply = await fetch(`/api/solution/comment/reply/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ body, parentCommentId: parentComment.id })
        });
        const text = await reply.text();
        if (reply.ok) {
            toast.success(text);
            onClose();
        }
        else {
            toast.error(text);
        }
    }
  return (
    <div className='fixed inset-0 bg-black/40 z-40 flex flex-row items-center justify-center'> 
      <div className='bg-black p-4 rounded  w-5/6 flex flex-col gap-3 relative text-white'>
              <button className='absolute -right-5 -top-5 bg-red-600 p-3 rounded-full' onClick={onClose}><MdClose /></button>
              <Content body={`Replying to @${parentComment.author.name}`} />
            
              <TextareaAutosize className='w-full bg-white/20 rounded p-2 form-textarea placeholder:text-white/80 resize-none' minRows={5} value={body} onChange={(e) => setBody(e.target.value)} />
              <button className='py-1 ring-offset-1 rounded bg-blue-500 ring-1 ring-white ' onClick={()=>handleReply()}>Reply</button>
             
        


        
        
      </div>
      
    </div>
        
  
  )
}

export default CreateSolutionReplyModal

'use client'
import { FullSheetCommentType } from './CommentModal'
import SubHeading from '../SubHeading'
import Content from '../Content'
import { MdClose } from 'react-icons/md'
import { BiSolidCommentAdd } from 'react-icons/bi'
import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { error } from 'console'

const ReplyModal = ({ onClose, parentComment }: { onClose: () => void, parentComment: FullSheetCommentType }) => {
    const [replyBody, setReplyBody] = useState('');
    const handleReply = () => {
        axios.post('/api/sheets/comments/replies', {
            body: replyBody,
            parentId: parentComment.id
        }).then(() => toast.success('Your reply was recorded')).catch((error) => error.response.data);
    }
  return (
      <div className='bg-black/30 flex flex-row items-center justify-center fixed inset-0 z-[9999] '>
          <div className='bg-black text-white  p-4 max-w-lg w-5/6 flex flex-col gap-6  relative'>
          <button className='p-4 bg-red-500 rounded-full absolute -top-5 -right-5 ' onClick={onClose}><MdClose /></button>
              <SubHeading body={`Replying to ${parentComment.author.name}`} />
              <Content body={parentComment.body || ''} className='truncate font-medium text-white  text-sm bg-white/20 p-2 rounded' />
              <div className='bg-white/20 w-full p-4 rounded flex flex-row items-center gap-6 '>
                  <input type="text" className='p-4 w-4/5 rounded focus:outline-none bg-white/10 text-white' placeholder='Type your Reply...' name="reply" id="reply" onChange={(e)=>setReplyBody(e.target.value)}  />
                  <button  className='bg-gray-400 p-4 rounded-full' onClick={()=>handleReply()}><BiSolidCommentAdd size={24} /></button>
              </div>
              
          </div>
      
    </div>
  )
}

export default ReplyModal

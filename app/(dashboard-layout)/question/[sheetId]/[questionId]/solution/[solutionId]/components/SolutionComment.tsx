'use client'

import React, {  useEffect, useState } from 'react'
import { SolutionCommentType } from '../page'
import Image from 'next/image'
import { dateString } from '@/app/libs/utility functions/dateString'
import { BiSolidDislike, BiSolidLike } from 'react-icons/bi'
import { FaEdit, FaReply } from 'react-icons/fa'
import { MdClose, MdDelete } from 'react-icons/md'
import {motion} from 'framer-motion'
import { DeleteComment } from '@/app/_actions/DeleteComment'
import SubHeading from '@/components/SubHeading'
import { TextareaAutosize } from '@mui/material'
import toast from 'react-hot-toast'
import CreateSolutionReplyModal from '@/components/modals/CreateSolutionReplyModal'
import { User } from '@prisma/client'
import { pusherClient } from '@/app/libs/pusher'
import { SheetCommentLikeAction } from '@/app/_actions/SheetCommentLikeAction'
import { SheetCommentDisLikeAction } from '@/app/_actions/SheetCommentDislikeAction'
import { comment } from 'postcss'


const EditSolutionCommentModal = ({ onClose,comment }: { onClose: () => void ,comment:SolutionCommentType}) => {
  const [body, setBody] = useState<string>(comment.body || '')
  const handleEdit = async () => {
    const res = await fetch('/api/solution/comment/edit', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ commentId:comment.id, body })
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
  return (
    <div className='fixed inset-0 bg-black/40 z-40 flex flex-row items-center justify-center'> 
      <div className='bg-black p-4 rounded max-w-md w-full flex flex-col gap-2 relative text-white'>
        <button className='absolute -right-5 -top-5 bg-red-600 p-3 rounded-full' onClick={onClose}><MdClose /></button>
        <SubHeading body='Edit Comment' className='underline' />
        <TextareaAutosize className='w-full bg-white/20 rounded p-2 form-textarea placeholder:text-white/80 resize-none' minRows={5} value={body} onChange={(e)=>setBody(e.target.value as string)} />
        <button className='py-1 ring-offset-1 rounded bg-blue-500 ring-1 ring-white ' onClick={()=>handleEdit()}>Edit Comment</button>


        
        
      </div>
      
    </div>
  )
  
}



const SolutionComment = ({ comment, solutionId,currentUser ,isReply,parentComment}: { comment: SolutionCommentType, solutionId: number,currentUser:User,isReply:boolean,parentComment?:SolutionCommentType}) => {
  const [deleteButton, setDeleteButton] = useState(false);
  const isAuthor = currentUser?.id === comment.authorId;
  const [editModal, setEditModal] = useState(false);
  const [replyModal, setReplyModal] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<SolutionCommentType[] | []>([])
  const [likes, setLikes] = useState<number>(comment.likes.length);
  const [dislikes, setDislikes] = useState<number>(comment.dislikes.length);

  useEffect(() => {
    const fetchReplies = async () => {
      const reply = await fetch(`/api/solution/comment/reply/${comment.id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }


        }
      );
      if(reply.ok){
        const data = await reply.json();
        setReplies(data);
        console.log('Comment Replies', data);
      }
      else {
        toast.error('Something went wrong');
      }
    }
    fetchReplies();
    pusherClient.subscribe(`comment`);
    pusherClient.bind('create:solutionreply', (data: SolutionCommentType) => {
      if (data.parentId === comment.id) {
     
        setReplies((prev) => [data, ...prev]);
      }
  
    })
    pusherClient.bind('delete:comment', (data: number) => {
      setReplies((prev) =>
        prev.filter((comment) => comment.id !== data)
      );
    });
    pusherClient.bind('update:comment', (data: SolutionCommentType) => {
      setReplies((prev) =>
        prev.map((comment) => (comment.id === data.id ? data : comment))
      );
     
      pusherClient.bind('like:solutioncomment',(data:{likes:number,dislikes:number,commentId:number})=>{{
        if(comment.id===data.commentId){
          setLikes(data.likes);
          setDislikes(data.dislikes);
        }
      }
      })
      pusherClient.bind('dislike:solutioncomment',(data:{likes:number,dislikes:number,commentId:number})=>{{
        if(data.commentId===comment.id){
          setLikes(data.likes);
          setDislikes(data.dislikes);
        }
      }
      })
    });
    return () => {
      pusherClient.unsubscribe(`comment`);
      pusherClient.unbind('create:solutionreply');
      pusherClient.unbind('delete:comment');
      pusherClient.unbind('update:comment');
     
      pusherClient.unbind('like:solutioncomment');
      pusherClient.unbind('dislike:solutioncomment');
    }
    
  }, [comment.id])
  

  
  
  
    
  return (
    <>
      {editModal && <EditSolutionCommentModal onClose={() => setEditModal(false)} comment={comment} />}
     {replyModal && <CreateSolutionReplyModal onClose={()=>setReplyModal(false)} parentComment={comment} />}
      <div className='flex flex-col lg:gap-1 xs:gap-0.5 w-full bg-black/60 p-2 rounded'>
        {isReply && <span className='lg:text-sm xs:text-xs'>Replying to @{ parentComment?.author.name}</span>}
        <div className='flex flex-row items-start lg:gap-4 '>

          <Image src={comment.author.image || '/images/user.png'} alt='author' width={50} height={50} className='rounded-full object-cover h-7 w-7 bg-blue-300' />
          <span className='xs:text-xs lg:text-sm' >{comment.author.name}</span>
          <span className='xs:text-xs lg:text-sm'>Created :{dateString(new Date(comment.createdAt))}</span>
        </div>
        <pre className='bg-white/20 lg:text-sm xs:text-xs p-2 rounded whitespace-break-spaces  '>{comment.body}</pre>
        <div className='flex flex-row items-center gap-3' onMouseEnter={()=>setDeleteButton(true)} onMouseLeave={()=>setDeleteButton(false)}>
          <button className='flex flex-row items-center gap-1 text-green-500' onClick={()=>SheetCommentLikeAction(comment.id)}>
            <BiSolidLike size={16} />
            {likes}
          </button>
          <button className='flex flex-row items-center gap-1 text-red-500' onClick={()=>SheetCommentDisLikeAction(comment.id)}>
            <BiSolidDislike size={16} />
            {dislikes}
          </button>
          <button className='flex flex-row items-center gap-1 lg:text-sm xs:text-xs px-2 rounded ' onClick={()=>setReplyModal(true)}>
            <span>Reply</span>
            <FaReply  size={16} />
          </button>
          <button className='flex flex-row items-center gap-1 lg:text-sm xs:text-xs px-2 rounded ' onClick={()=>setShowReplies((prev)=>!prev)} >
            <span className='text-blue-600 font-medium'>{showReplies ? 'Hide Replies' : `Replies(${replies?.length})`}</span>
           
          </button>

      
          {isAuthor && <motion.button animate={deleteButton ? 'show' : 'hide'} variants={{
            show: {
              display: 'flex',
              opacity: 1
            }
            ,
            hide: {
              display: 'none',
              opacity: 0
            }
          }} transition={{ duration: 0.6 }} onClick={ ()=>DeleteComment(comment.id)} className='flex flex-row items-center gap-1 lg:text-sm xs:text-xs bg-black p-2 rounded-full  ' >
              <MdDelete size={20} />
            </motion.button>}
          {isAuthor && <motion.button animate={deleteButton ? 'show' : 'hide'} variants={{
            show: {
              display: 'flex',
              opacity: 1
            }
            ,
            hide: {
              display: 'none',
              opacity: 0
            }
          }} transition={{ duration: 0.6 }} onClick={ ()=>setEditModal(true)} className='flex flex-row items-center gap-1 lg:text-sm xs:text-xs bg-blue-400 p-2 rounded-full  ' >
              <FaEdit size={16} />
            </motion.button>}
      
        </div>
        { <motion.div className='flex flex-col gap-1 w-full bg-black/30 rounded' animate={showReplies ? 'showreplies' : 'hidereplies'} variants={{
          showreplies: { scale:1, opacity: 1,display:'flex' },
          hidereplies: { scale:0,opacity: 0,display:'none'}
        }} transition={{duration:0.5,delay:0.2}}>
          { replies.length!==0?replies.map((reply) => (
            <SolutionComment key={reply.id} comment={reply} solutionId={solutionId} currentUser={currentUser} isReply={true} parentComment={comment} />
          )):<span className='bg-black/60 text-white py-2 px-4 rounded '>No Replies Posted Yet</span>}
        </motion.div>}
      
      </div>
    </>
  )
}

export default SolutionComment

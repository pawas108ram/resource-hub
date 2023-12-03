'use client'
import { LikeQuestionById } from '@/app/_actions/LikeQuestionById'
import { Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { BiSolidDislike, BiSolidLike } from 'react-icons/bi'
import { FullQuestionType } from '../page'
import { DislikeQuesitonById } from '@/app/_actions/DislikeQuestionById'
import { pusherClient } from '@/app/libs/pusher'


const HandleQuestionLikeDislike = ({ question }: { question: FullQuestionType }) => {
  
  const isConnected = question.questionStatus;
  const [questionLikes, setQuestionLikes] = useState(question.likes.length);
  const [questionDislikes, setQuestionDislikes] = useState(question.dislikes.length);
 
  useEffect(() => {
    if (!isConnected) {
      const makeConnection = async () => {
        const connect = await fetch(`/api/questions/question/connect`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ questionId: question.id }),
        });
        

      

      }
      makeConnection();
    }
    
  }, [isConnected, question])
  
  useEffect(() => {
   
      pusherClient.subscribe(`question-${question.id}`);
      pusherClient.bind('question:like', (data:{likes:number,dislikes:number,questionId:number}) => {
        if (question.id === data.questionId) {
         
          setQuestionLikes(data.likes);
          setQuestionDislikes(data.dislikes);
         
          
        }
      })
    pusherClient.bind('question:dislike', (data: { likes: number, dislikes: number, questionId: number }) => {
        
        if (question.id === data.questionId) {
         
          setQuestionLikes(data.likes);
          setQuestionDislikes(data.dislikes);
          
         
          
        }
      })
  
    return () => {
      pusherClient.unsubscribe(`question-${question.id}`);
      pusherClient.unbind('question:like');
      pusherClient.unbind('question:dislike');
    }

  }, [questionLikes, questionDislikes,question])
  
  return (
      <div className='flex flex-row items-center gap-4 xs:text-xs lg:text-sm '>
          <div className="flex flex-col gap-0.5  text-green-500">
            <button className='flex flex-row items-center gap-2 text-green-500' onClick={()=>LikeQuestionById(question.id)}>
            
            <Tooltip title='Like Question' placement='top'>
              < BiSolidLike size={24} />
            </Tooltip>
                    
                    <span>{questionLikes}</span>
                    
        </button>
        <span>Like</span>
          </div>
      <div className="flex flex-col gap-0.5 text-red-500">
        <button className='flex flex-row items-center gap-2 text-red-500' onClick={()=>DislikeQuesitonById(question.id)}>
            <Tooltip title='Dislike Button' placement='top'>
              <BiSolidDislike size={24} />
            </Tooltip>
        
          <span >{questionDislikes}</span>
        </button>
        <span>Dislike</span>
      </div>
    </div>
  )
}

export default HandleQuestionLikeDislike

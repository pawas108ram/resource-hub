'use client'
import React, { useEffect, useState } from 'react'
import { SolutionCommentType } from '../page'
import SolutionComment from './SolutionComment'
import { User } from '@prisma/client'

import { pusherClient } from '@/app/libs/pusher'
import { FaComment } from 'react-icons/fa'

const SolutionComments = ({ solutionId, currentUser }: { solutionId: number,currentUser:User }) => {
  const [comments, setComments] = useState<SolutionCommentType[]>([]);
  useEffect(() => {
    (async () => {
      
      const comments = await fetch(`/api/comment/solution/${solutionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store',
        next: { tags: ["SolutionComments"] }
      }).then((res) => res.json());
      setComments(comments);
    })();
  }, [solutionId])
  useEffect(() => {
    pusherClient.subscribe(`solution-${solutionId}`);
    pusherClient.bind('create:comment', (data:SolutionCommentType) => {
      setComments((prev) => [data, ...prev]);
    })
    pusherClient.subscribe('comment');
    pusherClient.bind('delete:comment', (data:number) => {
      setComments((prev) => prev.filter((comment) => comment.id !== data));
    })
    pusherClient.bind('update:comment', (data:SolutionCommentType) => {
      setComments((prev) => prev.map((comment) => comment.id === data.id ? data : comment));
    })
    return () => {
      pusherClient.unsubscribe(`solution-${solutionId}`);
      pusherClient.unbind('create:comment');
      pusherClient.unbind('comment:delete');
      pusherClient.unbind('comment:update');
      pusherClient.unsubscribe('comment');
    }
    }, [solutionId])
  

  
  return (
    <>
      <div className='flex flex-row items-center py-2 px-4 justify-between'>
                    <div className="flex flex-row items-center gap-4">
                        <FaComment size={20} />
                        <span className='text-xl font-semibold'>Comments({comments?.length || '0' })</span>
                    </div>
                   
                </div>
      {comments.length > 0 ? <div className='flex flex-col lg:gap-2 xs:gap-1'>{comments.map((comment) => (<SolutionComment isReply={false}  solutionId={solutionId} comment={comment} key={comment.id} currentUser={currentUser!} />))}</div>:<span className='bg-black/60 text-white py-2 px-4 rounded '>No Comments Posted Yet</span>}
          
      </>
  )
}

export default SolutionComments

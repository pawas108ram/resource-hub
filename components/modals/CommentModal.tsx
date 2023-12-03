'use client'
import { MdClose } from 'react-icons/md';
import {BiSolidCommentAdd} from 'react-icons/bi'
import SubHeading from '../SubHeading';
import { useEffect, useState } from 'react';
import { Comment, CommentDislikes, CommentLikes, SheetDislikes, SheetLikes, User } from '@prisma/client';
import CommentCard from '../Cards/CommentCard';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getSheetAuthor } from '@/app/_actions/getSheetAuthor';
import { parse } from 'path';
import { pusherClient } from '@/app/libs/pusher';
interface CommentModalProps{
    onClose: () => void;
    sheetId?: number;
    currentUserId: number;
    resourceId?: number;
}
export type FullSheetCommentType = Comment & {
    likes: (CommentLikes & {
        user: User;
    })[];
    dislikes: (CommentDislikes & {
        user: User;
    })[];
    replies: FullSheetCommentType[];
  

    author: User;
}



const CommentModal: React.FC<CommentModalProps> = ({ onClose, sheetId ,currentUserId,resourceId}) => {
    const [postComment, setPostComment] = useState('');
    const [comments, setPostComments] = useState<FullSheetCommentType[]>([]);
    const [commentLimit,setCommentLimit] = useState(5);
    
    useEffect(() => {
        const fetchData = async () => {
            if (sheetId) {
                
            
                const data = await fetch(`/api/sheets/comments/${sheetId}`).then((res) => res.json());
                setPostComments(data);
            }
            if (resourceId) {
                const data = await fetch(`/api/resources/comments/${resourceId}`).then((res) => res.json());
                setPostComments(data);
            }
        }
        fetchData();
    }, [sheetId,resourceId]);
    console.log(comments)

    const handleCommentPost = () => {
        if (sheetId) {
            axios.post('/api/sheets/comments', {
                body: postComment,
                sheetId: sheetId
            }).then(() => toast.success('Comment Posted')).catch((err) => toast.error(err.response.data));
        }
        if (resourceId) {
            axios.post('/api/resources/comments', {
                body: postComment,
                resourceId: resourceId
            }).then(() => toast.success('Comment Posted')).catch((err) => toast.error(err.response.data));
        }
    }

    useEffect(() => {
        pusherClient.subscribe('comment');
        pusherClient.bind('create:comment', (data: FullSheetCommentType) => {
            setPostComments((prev) => [data, ...prev]);
        });
        pusherClient.bind('delete:comment', (data: number) => {
            setPostComments((prev) =>
                prev.filter((comment) => comment.id !== data)
            );
        });
        pusherClient.bind('update:comment', (data: FullSheetCommentType) => {
            setPostComments((prev) =>
                prev.map((comment) => (comment.id === data.id ? data : comment))
            );
        });
        
            
        return () => {
            pusherClient.unsubscribe('comment');
            pusherClient.unbind('create:comment');
            pusherClient.unbind('update:comment');
            pusherClient.unbind('delete:comment');
        }
    }, [sheetId,resourceId])
    
  
    
  return (
      <div className='bg-black/30 inset-0 fixed z-[999] flex flex-row items-center justify-center  '>
          <div className='p-4 bg-black text-white  max-w-lg w-full xs:w-4/5 rounded h-[600px] shadow relative flex flex-col gap-4'>
              <button className='p-4 bg-red-500 rounded-full absolute -top-5 -right-5 ' onClick={onClose}><MdClose /></button>
              <SubHeading body='Post Your Comment' className=' text-center underline' />
              <div className='bg-white/20 w-full p-4 rounded flex flex-row items-center gap-6 '>
                  <input type="text" className='p-4 w-4/5 rounded focus:outline-none bg-white/10 text-white' placeholder='Type your comment...' name="comment" id="comment" onChange={(e)=>setPostComment(e.target.value)} />
                  <button onClick={()=>handleCommentPost()} className='bg-gray-400 p-4 rounded-full'><BiSolidCommentAdd size={24} /></button>
              </div>
              <SubHeading body='Comments ' className='text-white underline' />
              <div className='flex flex-col gap-2 overflow-y-auto h-full'>
                  {comments!=undefined && comments.length!==0  ?comments?.slice(0,commentLimit).map((comment) => {
                      return <CommentCard key={comment.id} comment={comment} currentUserId={currentUserId}  />
                  }) : <span className='text-white text-center  bg-white/20 p-4 w-full rounded text-2xl'>No Comments Yet</span>}
                  {comments.length>commentLimit && <button className=' p-4 rounded text-black' onClick={()=>setCommentLimit((prev)=>prev+5)}>Load More</button>}
              </div>
              

              
          </div>
      
    </div>
  )
}

export default CommentModal

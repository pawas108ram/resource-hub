
'use client'
import { pusherClient } from "@/app/libs/pusher";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiSolidDislike, BiSolidLike } from "react-icons/bi";


const LikeAndDislikeComponent = ({ solutionId }: { solutionId: number }) => {
    
    const [solutionLikes, setLikes] = useState<number>(0);
    const [solutionDislikes, setDislikes] = useState<number>(0);
    type ActionType = 'like' | 'dislike';

    const fetchLikes = async () => {
        const likes = await fetch(`/api/solution/singleSolution/likes/${solutionId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            cache: 'no-cache'

        }).then((res) => res.json());

        setLikes(likes);
    }
    const handleLikeDislike = (action: ActionType) => {
        const UploadLikeDislike = async () => {
            const res = await fetch(`/api/solution/singleSolution/${action === 'like' ? 'likes' : 'dislikes'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ solutionId: solutionId })
            });
            const text=await res.text();
            if (res.ok) {
                toast.success(text);
            }
            else {
                toast.error(text);
            }

        }
        UploadLikeDislike();
        
        


    }

   
    useEffect(() => {
        const fetchLikes = async () => {
            const likes = await fetch(`/api/solution/singleSolution/likes/${solutionId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                cache: 'no-cache'

            }).then((res) => res.json());

            setLikes(likes);
        }
        const fetchDislikes = async () => {
            const dislikes = await fetch(`/api/solution/singleSolution/dislikes/${solutionId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                cache:'no-cache'

            }).then((res) => res.json());

            setDislikes(dislikes);
        }
        fetchLikes();
        fetchDislikes();
    }, [solutionId])
    
    useEffect(() => {
        pusherClient.subscribe(`solution-${solutionId}`);
        pusherClient.bind('like:solutionId', (data: number) => {
            if (solutionId === data) {
                setLikes((prev) => prev + 1);
                setDislikes((prev) => prev - 1);
            }
        })
        pusherClient.bind('dislike:solutionId', (data: number) => {
            if (solutionId === data) {
                setLikes((prev) => prev - 1);
                setDislikes((prev) => prev + 1);
            }
        })

        return () => {
            pusherClient.unsubscribe(`solution-${solutionId}`);
            pusherClient.unbind('like:solutionId');
            pusherClient.unbind('dislike:solutionId');
        }
    },[solutionLikes,solutionDislikes,solutionId])
  
  return (
    <div className="flex flex-row items-center gap-4">
      <button className="flex flex-row items-center gap-1 text-green-500/90 " onClick={()=>handleLikeDislike('like')}>
        <BiSolidLike size={20} />

        <span className="text-sm">{solutionLikes}</span>
      </button>
      <button className="flex flex-row items-center gap-1 text-red-500/90 " onClick={()=>handleLikeDislike('dislike')}>
        <BiSolidDislike size={20} />
        <span className="text-sm">{solutionDislikes}</span>
      </button>
    </div>
  );
};

export default LikeAndDislikeComponent;

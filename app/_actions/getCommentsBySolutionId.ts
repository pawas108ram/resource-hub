
import { revalidateTag } from 'next/cache';

export const getCommentsBySolutionId=async(solutionId: string)=> {
    try {
      
        const comments = await fetch(`/api/comment/solution/${solutionId}`, {
            method: 'GET',
            
            cache:'no-store',
            next:{tags:["SolutionComments"]}
        });
       
       
        const commentsData = await comments.json();
        
        return commentsData;
      
    }
    catch (error) {
        console.log('Error getting comments by solution id: ', error);
        return null;
    }
}


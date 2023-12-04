
import { revalidateTag } from 'next/cache';
import { baseUrl } from './getAllSolutions';
export const getCommentsBySolutionId=async(solutionId: string)=> {
    try {
        const url = baseUrl();
        const comments = await fetch(`${url}/api/comment/solution/${solutionId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
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


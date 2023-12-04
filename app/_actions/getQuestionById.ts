import axios from "axios";



export const  getQuestion=async(questionId: string, currentUserId: number)=> {
   
    const res = await fetch(`/api/questions/question`, {
        method: "POST",
       
        body: JSON.stringify({
            questionId,
            currentUserId
        })
   })
    if (res.ok) {
        const data = await res.json();
        return data;

    }
    else {
        return null;
    }
}
import { NextPageContext } from "next";

export const baseUrlGiver = () => {
    return process.env.NODE_ENV === "production"?process.env.NEXT_PUBLIC_PRODUCTION_URL as string:process.env.NEXT_PUBLIC_DEVELOPMENT_URL as string;
}



export const  getQuestion=async(questionId: string, currentUserId: number)=> {
   const baseUrl = baseUrlGiver();
    const res = await fetch(baseUrl.concat('api/questions/question'), {
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
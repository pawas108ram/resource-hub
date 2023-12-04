import axios from "axios";
import { baseUrl } from "./getAllSolutions";


export const  getQuestion=async(questionId: string, currentUserId: number)=> {
    const url = baseUrl();
    const res = await fetch(`${url}/api/questions/question`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            questionId,
            currentUserId
        })
   })
    if (res.ok) {
        return await res.json();

    }
    else {
        return null;
    }
}
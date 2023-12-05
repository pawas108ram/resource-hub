import { baseUrlGiver } from "./getQuestionById";





export const getAllSolutions=async(questionId: string, query: string)=> {
  const encodedQuery = encodeURI(query);
 
  
  
  
  
  const baseUrl = baseUrlGiver();
  const req = await fetch(
    `${baseUrl}/api/solution/allSolution/${questionId}/?${encodedQuery}`,
    {
      cache: 'no-cache',
    }
  );
  if (req.status === 200) {
    const res = await req.json();
    return res;
  } else {
    return null;
  }
}

export const baseUrl = () => {
  const isPhone = process.env.NEXT_PUBLIC_IS_MOBILE;
  const phoneUrl = process.env.NEXT_PUBLIC_MOBILE_API_URL;
  const webUrl = process.env.NEXT_PUBLIC_API_URL;
  if (isPhone === 'true') {
    return phoneUrl as string;
  } else {
    return webUrl as string;
  }
}




export const getAllSolutions=async(questionId: string, query: string)=> {
  const encodedQuery = encodeURI(query);
  const url = baseUrl();
  
  
  
  
  
  const req = await fetch(
    `${url}/api/solution/allSolution/${questionId}/?${encodedQuery}`,
      { cache: 'no-cache', headers: { 'Content-Type': 'application/json' } }
  );
  if (req.status === 200) {
    const res = await req.json();
    return res;
  } else {
    return null;
  }
}

import toast from "react-hot-toast";

export const DislikeQuesitonById=async(questionId: number)=> {
    const res = await fetch('/api/solution/dislike', {
        method: 'POST',
        body: JSON.stringify({ questionId }),
        headers: {
            'Content-Type': 'application/json'
        }
    
    });
    const text = await res.text();
    if (res.ok) {
        toast.success(text);
    }
    else {
        toast.error(text);
    }

}
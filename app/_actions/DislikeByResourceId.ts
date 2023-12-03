import toast from "react-hot-toast";

export const  DislikeByResourceId=async(resourceId:number) =>{
    const res = await fetch('/api/resources/dislike', {
        method: 'POST',
        body: JSON.stringify({ resourceId }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const text = await res.text();
    if (res.status === 200) {
        toast.success(text);
    }
    else {
        toast.error(text);
    }
}
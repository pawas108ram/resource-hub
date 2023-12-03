import toast from "react-hot-toast";

export const SheetCommentDisLikeAction=async(id: number)=> {
   const res= await fetch('/api/sheets/comments/dislike', {
        method: 'POST',
        body: JSON.stringify({
            commentId: id
        })
   });
    if(res.status===200){
         toast.success('Comment Disliked');
    }
    else {
        const text = await res.text();
         toast.error(text);
    }
}
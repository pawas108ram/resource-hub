import toast from "react-hot-toast";

export const  SheetCommentLikeAction=async(id: number)=> {
   const res= await fetch('/api/sheets/comments/like', {
        method: 'POST',
        body: JSON.stringify({
            commentId: id
        })
   })
    if(res.status===200){
         toast.success('Comment Liked');
    }
    else {
        const text=await res.text();
         toast.error(text);
    }

}
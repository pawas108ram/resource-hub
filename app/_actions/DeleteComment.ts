import toast from "react-hot-toast";

export const DeleteComment=async(id: number)=> {
    await fetch('/api/comment/' + id, {
        method: 'DELETE',

        

    }).then(()=>toast.success('Comment Deleted')).catch((error)=>toast.error('There was a error in deleting the comment'));
}
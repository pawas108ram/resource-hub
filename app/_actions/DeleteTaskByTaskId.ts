import toast from "react-hot-toast";

export const  DeleteTaskByTaskId=async(taskId:number)=>{
    
        const deleteTask = await fetch(`/api/tasks/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            
            },
            body: JSON.stringify({ taskId: taskId })


        });
        if (deleteTask.ok) {
            toast.success('Task Deleted')
        }
        else {
            const text = await deleteTask.text();
            toast.error(text);
        }
    
    
}
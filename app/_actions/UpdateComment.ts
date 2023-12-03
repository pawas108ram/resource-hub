

export const  UpdateComment=async(id: number, body: string)=> {
    await fetch('/api/comment/update', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id,
            body
        })

    })
}
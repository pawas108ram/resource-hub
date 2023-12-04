import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function PUT(req: Request, res: Response) {
    try {
        const { id, body } = await req.json();
        if(!id){
            return new NextResponse('Unauthorized', { status: 401 });
        }
        const updatedComment = await prisma.comment.update({
            where:{
                id: parseInt(id)
            },
            data:{
                body
            },
            include: {
                likes: true,
                dislikes: true,
                author: true,
                replies: {
                    include: {
                        likes: true,
                        dislikes: true,
                        author: true,
                        replies: true
                    }
                }
            }
        });
        if(!updatedComment){
            return new NextResponse('Comment could not be updated', { status: 500 });
        }
        await pusherServer.trigger('comment', 'update:comment', updatedComment);
        
        return NextResponse.json(updatedComment, { status: 200 });
    }
    catch (error: any) {
        console.log('Comment Update Error: ', error)
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
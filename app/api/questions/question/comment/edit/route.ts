import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function PUT(req: Request, res: Response) {
    try {
        const { body, commentId } = await req.json();
        const updatedComment = await prisma.comment.update({
            where: {
                id: parseInt(commentId)
            },
            data: {
                body: body
            },
            include: {
                author: true,
                dislikes: true,
                likes: true,
                replies: {
                    include: {
                        likes: true,
                        dislikes: true,
                        author: true
                    }
                }
            }
        });
        if(!updatedComment) {
            return new NextResponse('Comment not found',{status:404});
        }
        await pusherServer.trigger('comment'+commentId, 'update:comment', updatedComment)
        return NextResponse.json('Comment Updated Successfully',{status:200});
        
    }
    catch (error) {
        console.log('Question Comment Edit Error', error);
        return new NextResponse('Something went wrong', { status: 500 });
    }
}
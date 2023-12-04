


import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
    try {
        const body = await req.json();
        const { commentId } = body;
        if (!commentId) {
            return new NextResponse('Insufficent data', { status: 400 });
        }
        const currentUser = await getCurrentUser();
        if (!currentUser || !currentUser.id) {
            return new NextResponse('UnAuthorized User', { status: 401 });
        }
        const comment = await prisma.comment.findUnique({
            where: {
                id: parseInt(commentId)
            }
        });
        if (!comment) {
            return new NextResponse('Comment not found', { status: 404 });
        }
        const commentLike = await prisma.commentLikes.findFirst({
            where: {
                commentId: parseInt(commentId),
                userId: currentUser.id
            }
        });
        if (commentLike) {
            const deleteLike = await prisma.commentLikes.delete({
                where: {
                    id: commentLike.id
                }
            });
            if (!deleteLike) {
                return new NextResponse('There was a error in disliking the comment', { status: 500 });
            }
            
        }
        const commentDislike = await prisma.commentDislikes.findFirst({
            where: {
                commentId: parseInt(commentId),
                userId: currentUser.id
            }
        });
        if(commentDislike){
            return new NextResponse('Comment already Disliked', { status: 200 });
        }
        const newCommentDislike = await prisma.commentDislikes.create({
            data: {
                commentId: parseInt(commentId),
                userId: currentUser.id
            }
        });
        if (!newCommentDislike) {
            return new NextResponse('There was a error in disliking the comment', { status: 500 });
        }
        const comments = await prisma.comment.findUnique({
            where: {
                id: parseInt(commentId)
            },
            include: {
                dislikes: true,
                likes: true,
            }
        });
        if (!comments) {
            return new NextResponse('Comment not found', { status: 404 });
        }
        await pusherServer.trigger(`comment`, 'dislike:solutioncomment', {likes:comments.likes.length,dislikes:comments.dislikes.length,commentId:parseInt(commentId)});
        return NextResponse.json('Disliked', { status: 200 });


    }
    catch (error) {
        console.log('Sheet_Comment_Like_Error', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
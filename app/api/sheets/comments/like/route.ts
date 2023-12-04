import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
    try {
        const request = await req.json();
        const { commentId } = request;
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
           
            return new NextResponse('Comment already Liked', { status: 404 });
        }
        const commentDislike = await prisma.commentDislikes.findFirst({
            where: {
                commentId: parseInt(commentId),
                userId: currentUser.id
            }
        });
        if (commentDislike) {
            const deleteDislike = await prisma.commentDislikes.delete({
                where: {
                    id: commentDislike.id
                }
            });
            if (!deleteDislike) {
                return new NextResponse('There was a error in disliking the comment', { status: 500 });
            }

        }
        const newCommentLike = await prisma.commentLikes.create({
            data: {
                commentId: parseInt(commentId),
                userId: currentUser.id
            }
        });
        if (!newCommentLike) {
            return new NextResponse('There was a error in liking the comment', { status: 500 });
        }
        const comments = await prisma.comment.findUnique({
            where: {
                id: parseInt(commentId)
            },
            include: {
                likes: true,
                dislikes: true,
            }
        });
        if (!comments) {
            return new NextResponse('Comment not found', { status: 404 });
        }
        await pusherServer.trigger(`comment`, 'like:solutioncomment', ({ likes: comments.likes.length, dislikes: comments.dislikes.length, commentId: parseInt(commentId) }));

        return new NextResponse('Comment Liked', { status: 200 });


    }
    catch (error) {
        console.log('Comment_Like_Error', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

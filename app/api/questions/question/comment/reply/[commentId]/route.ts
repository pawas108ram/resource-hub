import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { commentId: string } }) {
    
    try {
        const { commentId } = params;
        if (!commentId) {
            return new NextResponse('Missing commentId', { status: 400 });
        }
        const questionReplies = await prisma.comment.findMany({
            where: {
                parentId: parseInt(commentId)

            },
            include: {
                likes: true,
                dislikes: true,
                author: true,
               
                
            }
        });
        if (!questionReplies) {
            return new NextResponse('Not found', { status: 404 });
        }
        
        return NextResponse.json(questionReplies, { status: 200 });
        
    }
    catch (error) {
        console.log('Error getting replies by comment id: ', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
    try {
        const { parentCommentId, body } = await req.json();
        const currentUser = await getCurrentUser();
        if (!parentCommentId || !body) {
            return new NextResponse('Missing parentCommentId or body', { status: 400 });
        }
        if (!currentUser || !currentUser.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        if (body.length === 0) {
            return new NextResponse('Empty body', { status: 400 });
        }
        if (body.length > 500) {
            return new NextResponse('Body too long', { status: 400 });
        }
        
        const comment = await prisma.comment.create({
            data: {
                body: body,
                authorId: currentUser.id,
                parentId: parseInt(parentCommentId)
            },
            include: {
                likes: true,
                dislikes: true,
                author: true,
            }
        })
        if(!comment){
            return new NextResponse('Comment not found', { status: 404 });
        }
        pusherServer.trigger(`comment`, 'create:solutionreply', comment);
        return new NextResponse('Reply created', { status: 200 });


    }
    catch (error) {
        console.log('Reply_Create_Error', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
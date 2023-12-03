import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
    try {
        const {body, questionId } = await req.json();
        const currentUser = await getCurrentUser();
        if (!questionId) {
            return new NextResponse('Missing questionId', { status: 400 });
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
                questionId: parseInt(questionId)
            },
            include: {
                author: true,
                dislikes: true,
                likes: true,

            }
            
        })
        if (!comment) {
            return new NextResponse('Not found', { status: 404 });
        }
        pusherServer.trigger(`question-${questionId}`, 'create:comment', comment);
        return new NextResponse('Created Discussion Comment ', { status: 201 });


    }
    catch (error) {
        console.log('Error creating question Comment', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
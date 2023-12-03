import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
    try {
        const request = await req.json();
        const { body, resourceId } = request;
        console.log(body, resourceId);
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.id) {
        return new NextResponse('UnAuthorized', { status: 400 });
    }
    if (!body || !resourceId) {
        return new NextResponse('Incomplete Data', { status: 400 });
    }
    const resourceComment = await prisma.comment.create({
        data: {
            body: body,
            resourceId: parseInt(resourceId),
            authorId: currentUser.id,
        },
        include: {
            likes: true,
            dislikes: true,
            author: true,
            replies:true,
        }
    });
        if (!resourceComment) {
            return new NextResponse('Resource Comment not found', { status: 404 });
        }
        pusherServer.trigger('comment','create:comment',resourceComment)
    return new NextResponse('Resource Comment Created ', { status: 201 });
    }
    catch (error) {
        console.log('Comment Creation Error', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
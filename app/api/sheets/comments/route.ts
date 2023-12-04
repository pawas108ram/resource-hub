import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
    try {
        const request = await req.json();
        const { body, sheetId } = request;
        console.log(body, sheetId);
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.id) {
        return new NextResponse('UnAuthorized', { status: 400 });
    }
    if (!body || !sheetId) {
        return new NextResponse('Incomplete Data', { status: 400 });
    }
    const sheetComment = await prisma.comment.create({
        data: {
            body: body,
            sheetId: parseInt(sheetId),
            authorId: currentUser.id,
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
      await   pusherServer.trigger(`comment`, 'create:comment', sheetComment);
    return NextResponse.json(sheetComment, { status: 201 });
    }
    catch (error) {
        console.log('Comment Creation Error', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
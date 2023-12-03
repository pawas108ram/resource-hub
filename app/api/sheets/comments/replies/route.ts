import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
    try {
        const request = await req.json();
    const { body, parentId} = request;
    const currentUser = await getCurrentUser();
    if (!body || !parentId) {
        return new NextResponse('Insufficent data', { status: 400 });

    }
    if (!currentUser || !currentUser.id) {
        return new NextResponse('UnAuthorized User', { status: 401 });
    }
        const reply = await prisma.comment.update({
            where: {
                id: parseInt(parentId)
            },
            data: {
                replies: {
                    create: {
                        body: body,
                        authorId: currentUser.id
                    }
                }
            }
        });
        
       
    if (!reply) {
        return new NextResponse('There was a error in creation of Reply', { status: 500 });

    }

    return NextResponse.json(reply, { status: 201 });
    }
    catch (error) {
        console.log('Reply_Creation_Error', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
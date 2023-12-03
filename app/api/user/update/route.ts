import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function PUT(req: Request, res: Response) {
    try {
        const body = await req.json();
        const { name, bio, image } = body;
        const currentUser = await getCurrentUser();
        if(!currentUser || !currentUser.id){
            return new NextResponse('Unauthorized', { status: 401 });
        }
        const updatedUser = await prisma.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                name,
                bio,
                image
            },
            include: {
                ownSheet: true,
        sharedSheet: true,
        ownResource: true,
        sharedResource: true,
        ownComments: true,
                sheetsLikes: true,
        
        resourceLikes: true,
        sheetDislikes: true,
        resourceDislikes:true,
            }
        });
        if(!updatedUser){
            return new NextResponse('User could not be updated', { status: 500 });
        }
        pusherServer.trigger('user', 'user:update', 'User Updated');
        return NextResponse.json(updatedUser, { status: 200 });
    }
    catch (error) {
        console.log('Sheet_Deletion_Error: ', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function PUT(req: Request, res: Response) {
    try {
        const { title,
            description,
            isPublic,
            resourceId } = await req.json();
        if(!resourceId){
            return new NextResponse('Unauthorized', { status: 401 });
        }
        const updatedResource = await prisma.resource.update({
            where: {
                id: parseInt(resourceId)
            },
            data: {
                title,
                description,
                isPublic
            },
            include: {
                dislikes: true,
                likes: true,
                author: true,
                users: true
            }

        });
        if (!updatedResource) {
            return new NextResponse('Resource could not be updated', { status: 500 });
        }
        await pusherServer.trigger('resource', 'update:resource', updatedResource);
        return new NextResponse('Resource updated', { status: 200 });
        
    }
    catch (error: any) {
        console.log('Resource Update Error: ', error)
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
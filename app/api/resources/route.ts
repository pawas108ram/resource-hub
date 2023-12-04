import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
    try {
        const currentUser = await getCurrentUser();
        const body = await req.json();
        console.log(body);
        const { title, description, isPublic, tags,keys } = body;
        if (!title || !description ) {
            return new NextResponse('Missing title or description', { status: 400 });
        }
        if (tags.length === 0) {
            return new NextResponse('Missing tags', { status: 400 });
        }
        if (tags.length > 5) {
            return new NextResponse('Too many tags', { status: 400 });
        }
        if (keys > 10) {
            return new NextResponse('Too many keys', { status: 400 });
        }
        if (keys < 0) {
            return new NextResponse('Too few keys', { status: 400 });
        }
        if (!currentUser || !currentUser.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        const updateCurrentUser = await prisma.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                coins: currentUser.coins + 40
            }
        });
        if (!updateCurrentUser) {
            return new NextResponse('User update failed', { status: 400 });
        }
        const resource = await prisma.resource.create({
            data: {
                title,
                description,
                isPublic,
                tags: tags,
                keys: keys,
                author: {
                    connect: {
                        id: currentUser.id
                    }
                }
               
            }
        });
        await pusherServer.trigger('resource', 'create:resource', resource);
        return NextResponse.json(resource, { status: 201 });
    }
    catch (error) {
        console.log('Resource error: ', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
    
}
import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function PUT(req: Request, res: Response) {
    try {
        const { resourceId, keysNeeded, currentKeys } = await req.json();
        const currentUser = await getCurrentUser();
        if (!currentUser || !currentUser.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        if (keysNeeded > currentKeys) {
            return new NextResponse('Not enough keys', { status: 400 });
        }
        const ResourceCreateNewUser = await prisma.resource.update({
            where: {
                id: parseInt(resourceId)
            },
            data: {
                users: {
                    create: {
                        userId: currentUser.id
                    
                    }
                }
            }
        });
        const resource = await prisma.resource.findUnique({
            where: {
                id: parseInt(resourceId),
                OR: [
                    { authorId: currentUser.id },
                    {
                        users: {
                            some: {
                                userId: currentUser.id
                            }
                        }
                    }
                ]
            },
        });
        if (!resource) return new NextResponse('Resource Not Found', { status: 404 });
        
        await pusherServer.trigger('resource', 'user:resource', resource);
        await pusherServer.trigger('resource','remove:resource', resource.id)
        if (!ResourceCreateNewUser) return new NextResponse('Sheet Creation Failed', { status: 400 });
        const updateCurrentUser = await prisma.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                keys: currentKeys - keysNeeded
            }
        });
        if (!updateCurrentUser) return new NextResponse('User Update Failed', { status: 400 });
        return NextResponse.json(updateCurrentUser, { status: 201 });


    }
    catch (error) {
        console.log('Resource_Creation_Error: ', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
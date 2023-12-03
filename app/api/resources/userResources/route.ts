import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
    try {
        const currrentUser = await getCurrentUser();
        if (!currrentUser || !currrentUser.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        const resources = await prisma.resource.findMany({
            where: {
                users: {
                    some: {
                        userId: currrentUser.id
                    }
               }
            },
            include: {
                dislikes: true,
                likes: true,
                author: true,
                users: true
            }
        })
        if (!resources) {
            return new NextResponse('Not Found', { status: 404 });
        }
        return NextResponse.json(resources, { status: 200 });

    }
    catch (error) {
        console.log('User_Resource_Retrieval_Error: ', error);
        return new NextResponse('Internal Server Error', { status: 500 });

    }
}

export async function POST(req: Request, res: Response) {
    try {
        const { id } = await req.json();
        const currentUser = await getCurrentUser();
        if (!currentUser || !currentUser.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!id) {
            return new NextResponse('Missing sheetId', { status: 400 });
        }
        const existingResource = await prisma.resource.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                author: true,
                users: {
                    include: {
                        user: true
                    }
                },
                likes: true,
                dislikes: true
            }
        });
        if (!existingResource) {
            return new NextResponse('Resource not found', { status: 404 });
        }
        const existingUser = await prisma.resourceUser.findFirst({
            where: {
                user: {
                    id: currentUser.id
                },
                resource: {
                    id:parseInt(id)
                }
                }
           
       });
        if (existingUser) {
            return new NextResponse('User already has access to this sheet', { status: 400 });
        }
        const updateAuthor = await prisma.user.update({
            where: {
                id: existingResource.author.id
            },
            data: {
                coins: existingResource.author.coins + 20
            }
        })
        if (!updateAuthor) {
            return new NextResponse('User update failed', { status: 400 });
        }

        

        
        

        const userResource = await prisma.resourceUser.create({
            data: {
                userId: currentUser.id,
                resourceId: parseInt(id)
               
               
              
            },
            include: {
                resource: true,
                user: true
            }
            
        });

        if (!userResource) {
            return new NextResponse('User could not be added to the resource', { status: 500 });
        }
        pusherServer.trigger('resource', 'add:resource', existingResource);
        pusherServer.trigger('resource', 'remove:resource', userResource.resourceId);
        return NextResponse.json(userResource, { status: 201 });
    }
   

    catch (error) {
        console.log('User_Resource_Error: ', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }

}
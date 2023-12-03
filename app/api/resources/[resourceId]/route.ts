import AuthForm from "@/app/(site)/components/AuthForm";
import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import { questionStatus } from '../../../libs/const/questionStatus';
import { pusherServer } from "@/app/libs/pusher";

export async function GET(req: Request, {params}:{params:{resourceId:string}}) {
    try {
        const { resourceId } = params;
        
        const currentUser = await getCurrentUser();
        
        if (!currentUser || !currentUser.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        
        
        if (!resourceId) {
            return new NextResponse('Missing resourceId', { status: 400 });
        }

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
            include: {
                likes: true,
                dislikes: true,
                author: true,
                users: {
                    include: {
                        user: true
                    }
                
                },
                comments: {
                    include: {
                        likes: true,
                        dislikes: true,
                        author: true,
                        replies: true,
                    }

                },
                tasks: {
                    include: {
                        questionLinks: true,
                        fileLinks: true,
                        imageLinks: true,
                        videoLinks: true,
                        websiteLinks: true,
                        taskStatus: {
                            where: {
                                userId: currentUser.id
                            }
                        }
                        

                    },
                    
                }
            }
        });
        if(!resource){
            return new NextResponse('UnAuthorised', { status: 401 });
        }
        
        return NextResponse.json(resource, { status: 200 });
        
        
      
      


        

    }
    catch (error) {
        console.log('Resource error: ', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}

interface IParams{
    resourceId:string

}

export async function DELETE(req: Request, { params }:{params:IParams} ) {
    try {
        
        
        const currentUser = await getCurrentUser();
        const { resourceId} = params;
        
        if (!resourceId) {
            return new NextResponse('Missing sheetId', { status: 400 });
        }
        if (!currentUser || !currentUser.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        const resource = await prisma.resource.findFirst({
            where: {
                id: parseInt(resourceId),
                authorId: currentUser.id
            }
        
        });
        const resourceUser = await prisma.resourceUser.findFirst({
            where: {
                
                userId: currentUser.id,
                resourceId: parseInt(resourceId)
            }
        });
        if (!resource && !resourceUser) {
            return new NextResponse('Resource not found', { status: 404 });
        }
        if (resource) {
            const deleteUsers = await prisma.resourceUser.deleteMany({
                where: {
                    resourceId: parseInt(resourceId),

                }
            })
           

            const deletedResource = await prisma.resource.delete({
                where: {
                    id: parseInt(resourceId)
                }
            });
            pusherServer.trigger('resource', 'delete:resource', deletedResource.id)
            if (!deleteUsers || !deletedResource) {
                return new NextResponse('Resource could not be deleted propely', { status: 400 })
            }
            
            return NextResponse.json(deletedResource, { status: 200 });
        }
        if (resourceUser) {
           
            const userDelete = await prisma.resourceUser.delete({
                where: {
                    id: resourceUser.id,
                    userId: currentUser.id,
                    resourceId: parseInt(resourceId)
                },
            
            });
            pusherServer.trigger('resource', 'delete:resource', resourceUser.resourceId)
            if ( !userDelete) {
                return new NextResponse('User could not be deleted properly',{status:400})
            }
            return NextResponse.json(userDelete, { status: 200 });
        }
    }
        
    
    catch (error) {
        console.log('Resource Deletion Error: ', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
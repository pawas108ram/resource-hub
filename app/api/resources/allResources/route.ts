import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { ResourceTag } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
    try {
        const { searchParams } = new URL(req.url);
        console.log(searchParams);
        const author = searchParams.has('author') ? searchParams.get('author') : null;
        const createdAt = searchParams.has('createdAt') ? searchParams.get('createdAt') : null;
        const updatedAt = searchParams.has('updatedAt') ? searchParams.get('updatedAt') : null;
        const likes = searchParams.has('likes') ? searchParams.get('likes') : null;
        const users = searchParams.has('users') ? searchParams.get('users') : null;
        const comments = searchParams.has('comments') ? searchParams.get('comments') : null;
    
        const request = searchParams.has('request') ? searchParams.get('request') : null;
    
        const currentUser = await getCurrentUser();
        if (!currentUser || !currentUser.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        const resources = await prisma.resource.findMany({
            where: {
                NOT: {
                    authorId: currentUser.id
                },
                
                users: {
                    none: {
                        userId: currentUser.id
                    },
                
                },
                status: 'PUBLISHED',
                
                ...(author && {
                    author: {
                        name: {
                            contains: author as string,
                            mode: 'insensitive'
                    }
                    }
                }),
                
               
                
               
            },
            
            orderBy: {
                ...(createdAt && { createdAt: createdAt as 'asc' | 'desc' }),
                ...(updatedAt && { updatedAt: updatedAt as 'asc' | 'desc' }),
                ...(likes && { likes: { _count: likes as 'asc' | 'desc' } }),
                ...(users && { users: { _count: users as 'asc' | 'desc' } }),
                ...(comments && { comments: { _count: comments as 'asc' | 'desc' } }),
                ...(request && { request: { _count: request as 'asc' | 'desc' } })

               
            },
            include: {
                likes: true,
                dislikes: true,
                author: true,
            }
        });
        if(!resources) {
            return new NextResponse('No resources found', { status: 404 });
        }
        return NextResponse.json(resources, { status: 200 });

    }
    catch (error) {
        console.log('Resource error: ', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
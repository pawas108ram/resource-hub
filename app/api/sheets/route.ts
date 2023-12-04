import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function POST(req:Request,res:Response){
    try {
        const currentUser = await getCurrentUser();
        const body=await req.json();
        const { title, description, isPublic,keys } = body;
        if (!title) {
            return new NextResponse('Title is required', { status: 400 });
        }
        if (!currentUser || !currentUser.id) {
            return new NextResponse('Unauthorized', { status: 401 });;
        }
        if (keys < 0) {
            return new NextResponse('Too few keys', { status: 400 });
        }
        if (keys > 10) {
            return new NextResponse('Too many keys', { status: 400 });
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
        const Sheet = await prisma.sheet.create({
            data: {
                title,
                description,
                isPublic,
                keys: keys,
                author: {
                    connect: {
                        id: currentUser.id
                    }
                }
            }
        });
        await pusherServer.trigger('sheet', 'create:sheet', Sheet);
        if (!Sheet) return new NextResponse('Sheet Creation Failed', { status: 400 });
        console.log(Sheet);

        return NextResponse.json(Sheet, { status: 201 });


    }
    catch(error){
        console.log('Sheet_Creation_Error: ', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function GET(req: Request, res: Response) {

    try {
        const currentUser = await getCurrentUser();
        const { searchParams } = new URL(req.url);
        console.log(searchParams);
        const author = searchParams.has('author') ? searchParams.get('author') : null;
        const createdAt = searchParams.has('createdAt') ? searchParams.get('createdAt') : null;
        const updatedAt = searchParams.has('updatedAt') ? searchParams.get('updatedAt') : null;
        const likes = searchParams.has('likes') ? searchParams.get('likes') : null;
        const users = searchParams.has('users') ? searchParams.get('users') : null;
        const comments = searchParams.has('comments') ? searchParams.get('comments') : null;
        const questions = searchParams.has('questions') ? searchParams.get('questions') : null;
        const request = searchParams.has('request') ? searchParams.get('request') : null;
        
        
      
        if (!currentUser || !currentUser.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        const sheets = await prisma.sheet.findMany({
            where: {
                AND: [
                    
                    {
                        users: {
                            none: {
                                userId: currentUser.id
                            }
                        }
                    },
                   
                        
                    
                    {
                        NOT: {
                            authorId: currentUser.id
                        }
                    },
                    {
                        status:'PUBLISHED'
                    }
                  
                ],
                ...(author && {
                    author: {
                        name: {
                            contains: author as string,
                            mode: 'insensitive'
                        }
                    }
                })
            },
            orderBy: {
                ...createdAt && { createdAt: createdAt as 'asc' | 'desc' },
                ...updatedAt && { updatedAt: updatedAt as 'asc' | 'desc' },
                ...likes && {
                    likes: {
                    _count: likes as 'asc' | 'desc'
                }  },
                ...users && { users: { _count:users as 'asc' | 'desc' } },
                ...comments && { comments: { _count: comments as 'asc' | 'desc' } },
                ...questions && { questions: { _count: questions as 'asc' | 'desc' } },
                ...request && { request: { _count: request as 'asc' | 'desc' } },
            },
            include: {
                users: {
                    include: {
                        user:true
                    }
                },
                author: true,
                dilikes: true,
                likes: true,
            }
       })
        return NextResponse.json(sheets, { status: 200 });
    }
    catch (error) {
        console.log('Sheet_GETTING_Error: ', error);
        return new NextResponse('Internal Server Error', { status: 500 });
        
    }
}


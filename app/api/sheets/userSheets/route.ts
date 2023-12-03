import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

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
        const existingSheet = await prisma.sheet.findUnique({
            where: {
                id: id
            }
        });
        if (!existingSheet) {
            return new NextResponse('Sheet not found', { status: 404 });
        }
        const existingUser = await prisma.sheetUser.findFirst({
            where: {
                user: {
                    id: currentUser.id
                },
                sheet: {
                    id:id
                }
                }
           
       });
        if (existingUser) {
            return new NextResponse('User already has access to this sheet', { status: 400 });
        
        
        
        }

        const sheetAuthor = await prisma.sheet.findUnique({
            where: {
                id: id
            },
            include: {
                author: true,
                likes: true,
                dilikes: true,
                users: {
                    include: {
                        user: true
                    }
                }
             
            }
        })
        if (sheetAuthor) {
            const updateAuthor = await prisma.user.update({
                where: {
                    id: sheetAuthor.author.id
                },
                data: {
                    coins: sheetAuthor.author.coins + 20
                }
            });
            if (!updateAuthor) {
                return new NextResponse('User update failed', { status: 400 });
            }
            
        }



        
        
            

        const userSheet = await prisma.sheetUser.create({
            data: {
               
                sheet: {
                    connect: {
                        id: id
                    }
                },
                user: {
                    connect: {
                        id: currentUser.id
                }
                }
            },
            include: {
                sheet: true,
                user: true
            }
            
        });

        if (!userSheet) {
            return new NextResponse('User could not be added to the sheet', { status: 500 });
        }
        if (!sheetAuthor) {
            return new NextResponse('Sheet author could not be found', { status: 500 });
        }
        
        pusherServer.trigger('sheet', 'user:sheet', sheetAuthor);
        pusherServer.trigger('sheet', 'remove:sheet', sheetAuthor.id)
        return NextResponse.json(userSheet, { status: 201 });
    }
   

    catch (error) {
        console.log('User_Sheet_Error: ', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }

}

export async function GET(req: Request, res: Response) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser || !currentUser.id) {
            return new NextResponse('Unauthorized', { status: 401 });;
        }
        const sheets = await prisma.sheet.findMany({
            where: {
                users:
                    {
                        some: {
                            userId: currentUser.id
                        }
                    }
            },
            include: {
                dilikes: true,
                likes: true,
                
                author: true,
                
            }
        });
        if(!sheets){
            return new NextResponse('Not Found', { status: 404 });
        }
        return NextResponse.json(sheets, { status: 200 });
    }
    catch (error) {
        console.log('User_Sheet_Retrieval_Error: ', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
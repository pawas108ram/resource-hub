import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const params = searchParams.get('title');
        const currentUser = await getCurrentUser();
        if (!currentUser || !currentUser.id) { return new NextResponse('Unauthorized', { status: 401 }); }

        if (!params) {
            return new NextResponse('No Search Params Passed', { status: 400 });
        }

        const sheets = await prisma.sheet.findMany({
            where: {
                title: {
                    contains: params,
                    mode: "insensitive"
                },
                NOT: {
                    AND:[
                        { authorId: currentUser?.id },
                        {
                            users: {
                                every: {
                                    userId: currentUser?.id
                                }
                            }
                        }]
                    
            }
                
                
            },
            include: {
                author:true
            },
            orderBy: {
                createdAt: 'desc' 
            }
            
        });

        if (sheets.length === 0) {
            return new NextResponse('No Sheets Found', { status: 404 });
        }

        return NextResponse.json(sheets, { status: 200 });
    } catch (error) {
        console.error('Sheet Search Error: ', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

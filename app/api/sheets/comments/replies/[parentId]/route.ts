import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { parentId: string } }) {
    try {
        const { parentId } = params;
        if (!parentId) {
            return new NextResponse('Parent Id was not found', { status: 400 });
        }
        const replies = await prisma.comment.findMany({
            where: {
                parentId: parseInt(parentId)
            },
            include: {
                likes: {
                    include: {
                        user: true
                    }
                },
                dislikes: {
                    include: {
                        user: true
                    }
                },
                parent: {
                    include: {
                        author:true
                    }
                },
                replies:true,
                
                author:true
            }
        })
        if(!replies){
            return new NextResponse('Not able to fetch the replies', { status: 404 });
        }
        return NextResponse.json(replies, { status: 200 });
    }
    catch (error) {
        console.log('Reply_Retrieval_Error', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
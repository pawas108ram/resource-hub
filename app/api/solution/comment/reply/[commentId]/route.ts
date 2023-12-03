import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, {params}:{params:{commentId:string}}) {
    try {
        const { commentId } = params;
        if(!commentId) {
           return new NextResponse('Missing Comment Id', { status: 400 });
        }
        const replies = await prisma.comment.findMany({
            where: {
                parentId: parseInt(commentId)
            },
            include: {
                likes: true,
                dislikes: true,
                author: true,
            
            }
        });
        if(!replies) {
            return new NextResponse('No replies found', { status: 404 });
        }
        return NextResponse.json(replies,{status: 200});

        
    }
    catch (errror) {
        console.log('Error getting replies by comment id: ', errror);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
    
}
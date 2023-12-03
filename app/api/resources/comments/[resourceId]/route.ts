import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: {
    params: {
    resourceId:string
    }
}) {
    try {
        const { resourceId } = params;
    if (!resourceId) {
        return new NextResponse('Resource Id was not found', { status: 400 });
        }
        const comments = await prisma.comment.findMany({
            where: {
                resourceId: parseInt(resourceId),
                
                
            },
            include: {
                likes: {
                    include: {
                        user:true
                    }
                },
                dislikes: {
                    include: {
                        user:true
                    }
                },
                replies:true,
                
                

                author: true,
                
            }
        })
        if (!comments) {
            return new NextResponse('Not able to fetch the comments', { status: 404 });
        }
        return  NextResponse.json(comments, { status: 200 });
    }
    catch (error) {
        console.log('Resource_Comment_Retrieval_Error', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
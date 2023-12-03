import prisma from "@/app/libs/prismadb";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { solutionId: string } }) {
    try {
        const { solutionId } = params;
        if(!solutionId) {
           return new NextResponse('Missing Solution Id', { status: 400 });
        }
        const comments = await prisma.comment.findMany({
            where: {
                solutionId: parseInt(solutionId)
            },
            include: {
                likes: true,
                dislikes: true,
                author: true,
                replies: {
                    include: {
                        likes: true,
                        dislikes: true,
                        author: true,
                        replies:true
                    }
                }
            }
        });
        if(!comments) {
            return new NextResponse('No comments found', { status: 404 });
        }
        
        
        return NextResponse.json(comments,{status: 200});
        




    }
    catch (err) {
        console.log('Error getting comments by solution id: ', err);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
    try{
        const {commentBody,solutionId}=await req.json();
        const currentUser=await getCurrentUser();
        if(!commentBody){
            return new NextResponse('Missing commentBody',{status:400});
        }
        if (commentBody.length === 0) {
            return new NextResponse('Empty commentBody',{status:400});
        }
        if (commentBody.length > 500) {
            return new NextResponse('commentBody too long',{status:400});
        }
        if (!solutionId) {
            return new NextResponse('Missing solutionId',{status:400});
        }
        if (!currentUser || !currentUser?.id) {
            return new NextResponse('Unauthorized',{status:401});
        }
        const solutionComment = await prisma.comment.create({
            data: {
                body: commentBody,
                authorId: currentUser.id,
                solutionId: solutionId
            },
            include: {
                author: true,
                dislikes: true,
                likes: true,
            }
        });
        if(!solutionComment){
            return new NextResponse('Solution Comment couldnt be created ',{status:404});
        }
        pusherServer.trigger(`solution-${solutionId}`, 'create:comment', solutionComment);
        return NextResponse.json('Comment Created Successfully',{status:201});
            
        
    }
    catch(error){
        console.log('Solution Comment Creation Error',error);
        return new NextResponse('Something went wrong',{status:500});
    }
}
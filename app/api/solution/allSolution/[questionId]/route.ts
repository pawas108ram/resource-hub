
import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { Languages } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { questionId: string } }) {
    try {
        const { searchParams } = new URL(req.url);
        const language = searchParams.has('language') ? searchParams.get('language') : null;
        const createdAt = searchParams.has('createdAt') ? searchParams.get('createdAt') : null;
        const updateAt = searchParams.has('updateAt') ? searchParams.get('updateAt') : null;
        const likes = searchParams.has('likes') ? searchParams.get('likes') : null;
        const comments = searchParams.has('comments') ? searchParams.get('comments') : null;
        const seenBy= searchParams.has('seenBy') ? searchParams.get('seenBy') : null;
        
        
        const currentUser = await getCurrentUser();
       
        if (!currentUser ) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        const { questionId } = params;
        
        
        
        if (!questionId) {
            return new NextResponse('Question Id is required', { status: 400 });
        }
        const solutions = await prisma.solution.findMany({
            where: {
                questionId: parseInt(questionId),
                ...(language && { language: language as Languages }),

                

                
                
                
            },
            include: {
                author: true,
                likes: true,
                dislikes: true,
                seenBy: true,


            },
            orderBy: [
                { ...createdAt && { createdAt: createdAt as 'asc' | 'desc' } },
                { ...updateAt && { updatedAt: updateAt as 'asc' | 'desc' } },
                
               

            ]
           
                
            
        });
        if(!solutions){
            return new NextResponse('No solutions found', { status: 404 });
        }
        return NextResponse.json(solutions, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return new NextResponse('Something went wrong', { status: 500 });
    }
    
}
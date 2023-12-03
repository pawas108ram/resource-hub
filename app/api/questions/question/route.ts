
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(req:Request,res:Response) {
    try {
      
        const {questionId,currentUserId} = await req.json();
        
        if (!questionId) {
            return new NextResponse('Question ID is required', { status: 400 });
        }

      
        const question = await prisma.question.findUnique({
            where: {
                id: parseInt(questionId)
            },
            include: {
                likes: true,
                dislikes: true,
                solutions: true,
                   
                
                questionStatus: {
                    where: {
                        userId: parseInt(currentUserId)
                    }
                },
                
                
            }
        });
        if(!question) {
            return new NextResponse('Question not found', { status: 404 });
        }
        return NextResponse.json(question, { status: 200 });
        
    }
    catch (error) {
        console.log('Question_Retrieval_Error',error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}

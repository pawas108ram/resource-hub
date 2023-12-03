import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        
    const {title,
        language,
        description,
        type,
        shareMode,
        code,
        questionId,timeComplexity,spaceComplexity } = body;
    if(!title || !language || !description || !type || !shareMode || !code || !questionId) {
        return new NextResponse('Missing required fields', { status: 400 });
    }
    if (title.length > 100) {
        return new NextResponse('Title too long', { status: 400 });

    }
    if (description.length > 1000) {
        return new NextResponse('Description too long', { status: 400 });

    }
    if (code.length > 10000) {
        return new NextResponse('Code too long', { status: 400 });

        }
        
        const exisitingSolutionType = await prisma.solution.findFirst({
            where: {
                questionId: parseInt(questionId),
                type: type
            }
        });
        if (exisitingSolutionType) {
            return new NextResponse('Solution type already exists', { status: 400 });
        }
        const solution = await prisma.question.update({
            where: {
                id: parseInt(questionId),
                
            },
            data: {
                solutions: {
                    create: {
                        title,
                        language,
                        body: description,
                        type,
                        accessType: shareMode,
                        code,
                        authorId: currentUser.id,
                        timeComplexity,
                        spaceComplexity
                    },
                    
                        
                        
                }
                
                
            },
            include:{
                likes:true,
                dislikes: true,
                solutions: {
                    where: {
                        authorId: currentUser.id
                    
                    }
                },
                questionStatus: {
                    where: {
                        userId: currentUser.id
                    
                    }
                }
                
            }
            
            
        });
        pusherServer.trigger(`question-${questionId}`, 'create:solution', solution)
        
      
        
            
            
    
    if(!solution) {
        return new NextResponse('Error creating solution', { status: 500 });
        }
       
    return new NextResponse('Successfully Created Solution', { status: 201 });
    }
    catch (error) {
        console.log('Error creating solution', error);
        return new NextResponse('Error creating solution', { status: 500 });
    }
}
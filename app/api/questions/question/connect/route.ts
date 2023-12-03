import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
    try {
        const { questionId } = await req.json();
        const currentUser = await getCurrentUser();
        if (!currentUser || !currentUser.id) {
            return new NextResponse('Unauthorized', { status: 401 });

        }
        if (!questionId) {
            return new NextResponse('Question ID is required', { status: 400 });
        }
        const existingUser = await prisma.questionUserStatus.findFirst({
            where: {
                userId: currentUser.id,
                questionId: parseInt(questionId)
            
            }
        });
        if (existingUser) {
            return new NextResponse('Question already attempted', { status: 400 });
        }


        const questionUser = await prisma.question.update({
            where: {
                id: parseInt(questionId)
            },
            data: {
                questionStatus: {
                    create: {
                        userId: currentUser.id,
                        status: 'UNATTEMPTED'
                    }
                
              }
            }
        });
        if (!questionUser) {
            return new NextResponse('Question could not be updated', { status: 400 });
        }
        return NextResponse.json(questionUser, { status: 200 });
        
    }
    catch (error) {
        console.log('Question_Status_Update_Error',error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
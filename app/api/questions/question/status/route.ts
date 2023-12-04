import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function PUT(req: Request, res: Response) {
    try {
        const { questionId, status } = await req.json();
        const currentUser = await getCurrentUser();
        if (!questionId) {
            return new NextResponse('Question ID is required', { status: 400 });
        }
        if (!status) {
            return new NextResponse('Status is required', { status: 400 });
        }
        if (!currentUser || !currentUser.id) {
            return new NextResponse('Unauthorized', { status: 401 });

        }
        const existingQuestionUser = await prisma.questionUserStatus.findFirst({
            where: {
                userId: currentUser.id,
                questionId: parseInt(questionId)

            }
        });
        if (!existingQuestionUser) {
            const createQuestionUser = await prisma.questionUserStatus.create({
                data: {
                    userId: currentUser.id,
                    questionId: parseInt(questionId),
                    status: status
                }
            });
            if (!createQuestionUser) {
                return new NextResponse('Question could not be updated', { status: 400 });
            }

            
        }
        const existingUser = await prisma.questionUserStatus.updateMany({
            where: {
                userId: currentUser.id,
                questionId: parseInt(questionId)

            },
            data: {
                status: status
            }
        });
        if (!existingUser) {
            return new NextResponse('Question could not be updated', { status: 400 });
        }
        const updatedQuestion = await prisma.question.findUnique({
            where: {
                id: parseInt(questionId)
            },
            include: {
                likes: true,
                dislikes: true,
                solutions: true,
                questionStatus: {
                    where: {
                        userId: currentUser.id
                    }
                }

            }
        });
        if (!updatedQuestion) {
            return new NextResponse('Question not found', { status: 404 });
        }
        await pusherServer.trigger('question', 'update:question', updatedQuestion);
        return NextResponse.json(existingUser, { status: 200 });



    }
    catch (error) {
        console.log('Question_Status_Update_Error', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
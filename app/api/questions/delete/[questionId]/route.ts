import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { questionId: string } }) {
    try {
        const { questionId } = params;
        if (!questionId) {
            return new NextResponse('Missing required fields', { status: 400 });
        }
        console.log(questionId);
        const question = await prisma.question.findFirst({
            where: {
               id: parseInt(questionId),
            },
            
        })
        if (!question) {
            return new NextResponse('Question Deletion Failed', { status: 500 });
        }
        if (question.folderId) {
            const questionFolderUpdate = await prisma.folder.update({
                where: {
                    id: question.folderId
                },
                data: {
                    questions: {
                        disconnect: {
                            id: parseInt(questionId)
                        }
                    }
                },
                
            });
             
            const questionDelete = await prisma.question.delete({
                where: {
                    id: parseInt(questionId)
                }
            });
            

            
           
           await pusherServer.trigger('question','delete:folderquestion',question.id)
            if (!questionDelete || !questionFolderUpdate) {
                return new NextResponse('Question Deletion Failed', { status: 500 });
            }
            return new NextResponse('Question Deleted Successfully', { status: 200 });
           
        }

        const questionDelete = await prisma.question.delete({
            where: {
                id: parseInt(questionId)
            }
        });
        await pusherServer.trigger('question','delete:question',question.id)
        if (!questionDelete) {
            return new NextResponse('Question Deletion Failed', { status: 500 });
        }
        return new NextResponse('Question Deleted Successfully', { status: 200 });
    }
    catch (err) {
        console.log('Question Deletion Error: ', err);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
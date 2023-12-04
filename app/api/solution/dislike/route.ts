import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
    try {
        const { questionId } = await req.json();
        const currentUser = await getCurrentUser();
        if (!currentUser || !currentUser?.id) {
            return new NextResponse('UnAuthorised',{status:401})
        }
        const alreadyDisliked = await prisma.questionDislikes.findFirst({
            where: {
                questionId: parseInt(questionId),
                userId: currentUser.id
            }
        });
        if (alreadyDisliked) {
            return new NextResponse('Already Disliked',{status:409})
        }
        const liked = await prisma.questionLikes.findFirst({
            where: {
                questionId: parseInt(questionId),
                userId: currentUser.id
            }
        });
        if (liked) {
            await prisma.questionLikes.delete({
                where: {
                    id: liked.id
                }
            });
        }
        const dislike = await prisma.questionDislikes.create({
            data: {
                questionId: parseInt(questionId),
                userId: currentUser.id
            }
        });
        if (!dislike) {
            return new NextResponse('Could not dislike the question',{status:500})
        }
        const question = await prisma.question.findUnique({
            where: {
                id: parseInt(questionId)
            },
            include: {
                likes: true,
                dislikes: true,
            }
        })
        await pusherServer.trigger(`question-${parseInt(questionId)}`, 'question:dislike',{likes:question?.likes.length,dislikes:question?.dislikes.length,questionId:parseInt(questionId)});
        const sheet = await prisma.sheet.findFirst({
            where: {
                questions: {
                    some: {
                        id: parseInt(questionId)
                    }
                
                }
            },
            include: {
                author: true
            }
        });
        if (sheet) {
            const updateAuthor = await prisma.user.update({
                where: {
                    id: sheet.author.id
                },
                data: {
                    coins: sheet.author.coins - 5
                }
            });
            if(!updateAuthor){
                return new NextResponse('Author update failed',{status:400})
            }
        }
      

        return new NextResponse('Disliked', { status: 200 })
        



    }
    catch (error) {
        console.log('Question Dislike Error',error);
        return new NextResponse('Internal Server Error',{status:500})
    }
}
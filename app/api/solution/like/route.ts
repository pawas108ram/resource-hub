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
        const alreadyLiked = await prisma.questionLikes.findFirst({
            where: {
                questionId: parseInt(questionId),
                userId: currentUser.id

                
                
            }
        });
        if (alreadyLiked) {
            return new NextResponse('Already Liked',{status:409})
        }
        const disliked = await prisma.questionDislikes.findFirst({
            where: {
                questionId: parseInt(questionId),
                userId: currentUser.id
            }
        });
        if (disliked) {
            await prisma.questionDislikes.delete({
                where: {
                    id: disliked.id
                }
            });
        }



        const like = await prisma.questionLikes.create({
            data: {
                questionId: parseInt(questionId),
                userId: currentUser.id
            }
        });
        if (!like) {
            return new NextResponse('Could not like the question',{status:500})
        }
        const question=await prisma.question.findUnique({
            where:{
                id: parseInt(questionId),
            },
            include:{
               likes:true,
               dislikes:true,
            }
        })
        if(!question){
            return new NextResponse('Question Not Found',{status:404})
        }
        await pusherServer.trigger(`question-${questionId}`, 'question:like',{likes:question?.likes.length,dislikes:question?.dislikes.length,questionId:parseInt(questionId)});

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
                    coins: sheet.author.coins + 5
                }
            });
        }
        return new NextResponse('Liked',{status:200})
    }
    catch (e) {
        console.log('Question Like Erorr',e);
        return new NextResponse('Internal Server Error',{status:500})
    }
}
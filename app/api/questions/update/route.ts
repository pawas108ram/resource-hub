import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function PUT(req: Request, res: Response) {
    try {
        const { title, links, tags, questionId, difficulty } = await req.json();
        const currentUser = await getCurrentUser();
        if (!currentUser || !currentUser.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        if (!title || !links || !tags || !questionId || !difficulty) {
            return new NextResponse('Missing fields', { status: 400 });
        }
        if(title.length>100){
            return new NextResponse('Title too long', { status: 400 });
        }
        if(links.length>10){
            return new NextResponse('Too many links', { status: 400 });
        }
        if(tags.length>10){
            return new NextResponse('Too many tags', { status: 400 });
        }
        const updatedQuestion = await prisma.question.update({
            where: {
                id: questionId
            },
            data: {
                title,
                links,
                tags,
                difficulty
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
        pusherServer.trigger('question', 'update:question', updatedQuestion);
        if (!updatedQuestion) {
            return new NextResponse('Question not found', { status: 404 });
        }

        return new NextResponse('Question Updated', { status: 200 });



    }
    catch (err) {
        console.log(err);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
    
}
import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';
export async function GET(req:Request,{params}:{params:{questionId:string}}){
    try {
        const { questionId } = params;
        if (!questionId) {
            return new NextResponse('Missing questionId', { status: 400 });
        }
        const questionComments = await prisma.comment.findMany({
            where: {
                questionId: parseInt(questionId)

            },
            include: {
                author: true,
                likes: true,
                dislikes: true,
                replies: {
                    include: {
                        author: true,
                        likes: true,
                        dislikes: true
                    }
                }

            }

        });
        if(!questionComments){
            return new NextResponse('Not found', { status: 404 });
        }
        return NextResponse.json(questionComments, { status: 200 });

    }
    catch (error) {
        console.log('Error getting question Comments', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
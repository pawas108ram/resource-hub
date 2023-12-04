import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function PUT(req: Request, res: Response) {
    try {
     const {  title,
        body,
        language,
        code,
        timeComplexity,
        spaceComplexity,
        type,
        accessType,
            solutionId } = await req.json();
        if(!title || !body || !language || !code || !timeComplexity || !spaceComplexity || !type || !accessType || !solutionId) {
            return new NextResponse('Missing required fields', { status: 400 });
        }
        if(title.length>100){
            return new NextResponse('Title too long', { status: 400 });
        }
        if(body.length>500){
            return new NextResponse('Description too long', { status: 400 });
        }
        if(code.length>10000){
            return new NextResponse('Code too long', { status: 400 });
        }

        const question = await prisma.solution.findFirst({
            where: {
                id: parseInt(solutionId)
            },
            include: {
                question: true
            }
        });

        const typeSolutionalready = await prisma.solution.findFirst({
            where: {
                type: type,
                questionId: question?.question.id
                
            }
        });
        if (typeSolutionalready) {
            return new NextResponse('Solution type already exists', { status: 400 });
        }
        const updatedSolution = await prisma.solution.update({
            where: {
                id: parseInt(solutionId)
            },
            data: {
                title,
                body,
                language,
                code,
                timeComplexity,
                spaceComplexity,
                type,
                accessType
            }
        });
        if(!updatedSolution ) {
            return new NextResponse('Solution Update Error', { status: 500 });
        }
        const solutionquestion = await prisma.solution.findFirst({
            where: {
                id: parseInt(solutionId)
            },
            include: {
                question: true
            }
        })
        if (!solutionquestion) {
            return new NextResponse('Solution Update Error', { status: 500 });
        }
        await pusherServer.trigger(`question-${solutionquestion.question.id}`, 'update:solution', updatedSolution);
        return new NextResponse('Solution Updated Successfully', { status: 200 });
    }
    catch (error) {
        console.log('Solution Update Error: ', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
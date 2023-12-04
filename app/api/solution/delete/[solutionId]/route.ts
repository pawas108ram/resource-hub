import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { solutionId: string } }) {
    try {
        const { solutionId } = params;
        if (!solutionId) {
            return new NextResponse('Missing SolutionId', { status: 400 });
         }
         const currentUser = await getCurrentUser();
         if (!currentUser) {
             return new NextResponse('Unauthorized', { status: 401 });
         }
         const solution = await prisma.solution.delete({
             where: {
                 id: parseInt(solutionId),
                 authorId: currentUser.id
             }
         });
         if (!solution) {
             return new NextResponse('Solution not found', { status: 404 });
        }
        await pusherServer.trigger(`question-${solution.questionId}`, 'delete:solution', solution.id);
         return NextResponse.json(solution, { status: 200 });
    }
    catch (error) {
        console.log('Solution Delete Error: ', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }



   
    
}
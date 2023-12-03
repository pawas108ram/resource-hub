import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { questionId: string } }) {
    try {
        const { questionId } = params;
        const currentUser = await getCurrentUser();
        if (!currentUser || !currentUser.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        if(!questionId) {
           return new NextResponse(null, { status: 400 });
        }
        const solutions = await prisma.solution.findMany({
            where: {
                questionId: parseInt(questionId),
                authorId: currentUser.id
            }
        });
        if(!solutions) {
            return new NextResponse(null, { status: 404 });
        };
        return NextResponse.json(solutions,{status: 200});
    }
    catch (err) {
        console.log('Error getting solutions by question id: ', err);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
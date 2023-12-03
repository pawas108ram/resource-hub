import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, {params}:{params:{solutionId:string}}) {
    try {
        const { solutionId } = params;
        const currentUser = await getCurrentUser();
        if (!solutionId) {
            return new NextResponse('Missing solutionId', { status: 400 });
        }
        if (!currentUser || !currentUser.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        const seenSolutions = await prisma.solutionViews.findMany({
            where: {
                solutionId: parseInt(solutionId),
                
            }
        });
        if (!seenSolutions) {
            return new NextResponse('Solution not found', { status: 404 });
        }
        return NextResponse.json(seenSolutions.length, { status: 200 });
    }
    catch (error) {
        console.log('Solution_Seen_Error', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
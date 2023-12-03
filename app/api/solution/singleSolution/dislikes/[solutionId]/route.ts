import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { solutionId: string } }) {
    try {
        const { solutionId } = params;
        if (!solutionId) {
            return new NextResponse('Solution Id is required', { status: 400 });
        }
        const dislikes = await prisma.solutionDislikes.findMany({
            where: {
                solutionId: parseInt(solutionId)
            },
        }
        );
        if (!dislikes) {
            return new NextResponse('Solution not found', { status: 404 });
        }
        return NextResponse.json(dislikes.length, { status: 200 });

    }
    catch (error) {
        console.log('Single Solution Dislike Retrieval Error', error);
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
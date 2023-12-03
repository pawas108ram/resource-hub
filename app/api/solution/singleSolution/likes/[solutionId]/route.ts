import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { solutionId: string } }) {
    try {
        const { solutionId } = params;
        if (!solutionId) {
            return new NextResponse('Solution Id is required', { status: 400 });
        }
        const likes = await prisma.solutionLikes.findMany({
            where: {
                solutionId: parseInt(solutionId)
            },
        }
        );
        if (!likes) {
            return new NextResponse('Solution not found', { status: 404 });
        }
        
        return NextResponse.json(likes.length, { status: 200 });

    }
    catch (error) {
        console.log('Single Solution Dislike Retrieval Error', error);
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { solutionId: string } }) {
    try {
        const { solutionId } = params;
        if (!solutionId) {
            return new NextResponse('Solution Id is required', { status: 400 });
        }
        const solution = await prisma.solution.findUnique({
            where: {
                id: parseInt(solutionId)
            },
            include: {
                likes: true,
                dislikes: true,
                seenBy: true,
                author: true,
                
                }

            
        });
        if (!solution) {
            return new NextResponse('Solution not found', { status: 404 });
        }
        return  NextResponse.json(solution, { status: 200 });
    
    }
    catch (error) {
        console.log('Single Solution Error',error);
        return new NextResponse('Internal Server Error',{status:500})
    }
}
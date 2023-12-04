import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
    try {
        const { solutionId } = await req.json();
        const currentUser = await getCurrentUser();
        if (!solutionId) {
            return new NextResponse('Missing solutionId', { status: 400 });
        }
        if (!currentUser || !currentUser.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        const seenSolution = await prisma.solutionViews.findFirst({
            where: {
                solutionId: parseInt(solutionId),
                userId: currentUser.id
            }
        });
        if (seenSolution) {
            return new NextResponse('Solution already seen', { status: 200 });
        }

        const solution = await prisma.solution.update({
            where: {
                id: parseInt(solutionId)
            
            },
            data: {
                seenBy: {
                    create: {
                        userId: currentUser.id,
                        
                    }
                }
            }

        });
        if (!solution) {
            return new NextResponse('Solution not found', { status: 404 });
        }
        await pusherServer.trigger(`solution-${solution.id}`, 'seen:solution', solution.id);
        return new NextResponse('Solution Seen', { status: 200 });
    }
    catch (error) {
        console.log('Solution_Seen_Error', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}


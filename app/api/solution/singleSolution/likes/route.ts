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
        const likedSolution = await prisma.solutionLikes.findFirst({
            where: {
                solutionId: parseInt(solutionId),
                userId: currentUser.id
            }
        });
        if (likedSolution) {
            return new NextResponse('Solution already liked', { status: 200 });
        }
        const dislikedSolution = await prisma.solutionDislikes.findFirst({
            where: {
                solutionId: parseInt(solutionId),
                userId: currentUser.id
            }
        });
        if (dislikedSolution) {
            await prisma.solutionDislikes.delete({
                where: {
                    id: dislikedSolution.id
                }
            });
        }

        const solution = await prisma.solution.update({
            where: {
                id: parseInt(solutionId)
            },
            data: {
                likes: {
                    create: {
                        userId: currentUser.id
                    }
                }
            },
            include: {
                author: true,
            }
        });
        const updateAuthor = await prisma.user.update({
            where: {
                id: solution.author.id
            },
            data: {
                coins: solution.author.coins + 5
            }
        });
        if (!updateAuthor) {
            return new NextResponse('Author update failed', { status: 400 });
        }
        if (!solution) {
            return new NextResponse('Solution not found', { status: 404 });
        }
        await pusherServer.trigger(`solution-${solution.id}`, 'like:solutionId', solution.id);
        return new NextResponse('Solution Liked', { status: 200 });


    }
    catch (error) {
        console.log('Solution_Like_Error', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
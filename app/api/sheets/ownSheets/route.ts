import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser || !currentUser.id) {
            return new NextResponse('Unauthorized', { status: 401 });;
        }
        const sheets = await prisma.sheet.findMany({
            where: {
               authorId: currentUser.id
                
            },
            include: {
                dilikes: true,
                likes: true,
                author: true,
                users: true
            }
        })
        if (!sheets) {
            return new NextResponse('Not Found', { status: 404 });
        }
        return NextResponse.json(sheets, { status: 200 });
    }
    catch (error) {
        console.log('Sheet_Retrieval_Error: ', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}


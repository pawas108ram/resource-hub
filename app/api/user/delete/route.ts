import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, res: Response) {
    try {
        const { userId } = await req.json();
        if (!userId) {
            
            return new NextResponse('Missing userId', { status: 400 });
        }
        const user = await prisma.user.delete({
            where: {
                id: parseInt(userId)
            }
        });
        if (!user) {
            return new NextResponse('User not found', { status: 404 });
        }
        return NextResponse.json(user, { status: 200 });

    }
    catch (error) {
        console.log('User_Delete_Error: ', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
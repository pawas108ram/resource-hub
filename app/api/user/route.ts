import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
    try {
        const { email } = await req.json();
        if (!email) {
            return new NextResponse('Missing email', { status: 400 });
        }
        const user = await prisma.user.findFirst({
            where: {
                email
            }
        });
        if (!user) {
            return new NextResponse('User not found', { status: 404 });
        }
        return NextResponse.json(user, { status: 200 });

    }
    catch (error) {
        console.log('User_Search_Error: ', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
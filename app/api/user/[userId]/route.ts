import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

  

export async function GET(req: Request, { params }: {
    params: {
        userId: string
    }
}) {
    try {
        const { userId } = params;
        console.log('userId: ', userId);
        if(!userId){
            return new NextResponse('User Id is required', { status: 400 });
        }
        const currentUser = await prisma.user.findFirst({
            where: {
                id: parseInt(userId)
            },
            include: {
                ownSheet: true,
                sharedSheet: true,
                ownResource: true,
                sharedResource: true,
                ownComments: true,
                sheetsLikes: true,
                resourceLikes: true,
                sheetDislikes: true,
                resourceDislikes: true,



            }
        });
        if(!currentUser){
            return new NextResponse('User not found', { status: 404 });
        }
        return NextResponse.json(currentUser, { status: 200 });
    }
    catch (error) {
        console.log('Sheet_GETTING_Error: ', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
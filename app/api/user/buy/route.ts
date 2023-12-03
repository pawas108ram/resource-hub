import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function PUT(req: Request, res: Response) {
    try {
        const { coinsToDeduct, keysToAdd, currentUserCoin } = await req.json();
        const currentUser = await getCurrentUser();
        if (!currentUser || !currentUser.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        if (coinsToDeduct > currentUserCoin) {
            return new NextResponse('Not enough coins', { status: 400 });
        }
        const updateCurrentUser = await prisma.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                coins: currentUser.coins - coinsToDeduct,
                keys: currentUser.keys + keysToAdd
            }
        });
       

        if (!updateCurrentUser) return new NextResponse('User Update Failed', { status: 400 });

        pusherServer.trigger('user','update:user',updateCurrentUser);
        

        return NextResponse.json('Purchase was Successfull', { status: 201 });


    }
    catch (error) {
        console.log('Purchase_Error: ', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
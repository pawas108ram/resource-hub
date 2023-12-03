import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import {  pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function PUT(req: Request, res: Response) {
    try {
        const { sheetId, keysNeeded, currentKeys } = await req.json();
        const currentUser = await getCurrentUser();
        if (!currentUser || !currentUser.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        if (keysNeeded > currentKeys) {
            return new NextResponse('Not enough keys', { status: 400 });
        }
        const SheetCreateNewUser = await prisma.sheet.update({
            where: {
                id: parseInt(sheetId)
            },
            data: {
                users: {
                    create: {
                        userId: currentUser.id
                    
                    }
                }
            },
            include: {
                likes: true,
                dilikes: true,
                users: {
                    include: {
                        user: true
                    }
                },
                author: true
            }
        });
        if (!SheetCreateNewUser) return new NextResponse('Sheet Creation Failed', { status: 400 });
        const updateCurrentUser = await prisma.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                keys: currentKeys - keysNeeded
            }
        });
        pusherServer.trigger('sheet', 'user:sheet', SheetCreateNewUser);
        pusherServer.trigger('sheet','remove:sheet',SheetCreateNewUser.id)
        if (!updateCurrentUser) return new NextResponse('User Update Failed', { status: 400 });
        return NextResponse.json(updateCurrentUser, { status: 201 });


    }
    catch (error) {
        console.log('Sheet_Creation_Error: ', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(req:Request,res:Response){
    try {
        const body = await req.json();
    const { sheetId } = body;
    const currentUser = await getCurrentUser();
    if(!currentUser || !currentUser.id){
        return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!sheetId) {
        return new NextResponse('Bad Request', { status: 400 });
    }
    const sheetLiked = await prisma.sheetLikes.findFirst({
        where: {
            sheetId,
            userId: currentUser.id

        }
    });
        const sheetDisliked = await prisma.sheetDislikes.findFirst({
        where: {
            sheetId,
            userId: currentUser.id

            }
        });
        if (sheetDisliked) {
        const deleteSheetDislike = await prisma.sheetDislikes.delete({
            where: {
                id: sheetDisliked.id
            }
        });
        if (!deleteSheetDislike) {
            return new NextResponse('Could not remove dislike', { status: 500 });

            }
        }

    if (sheetLiked) {
        return new NextResponse('Sheet Already Liked', { status: 400 });

    }
    const likeSheet = await prisma.sheetLikes.create({
        data: {
            sheetId,
            userId: currentUser.id
        }
    });
    if (!likeSheet) {
        return new NextResponse('Could not like the sheet', { status: 500 });
    }
    return new NextResponse('Liked', { status: 200 });
    }
    catch (error) {
        console.log('Sheet_Like_Error', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
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
            return new NextResponse('Sheet Already Disliked', { status: 400 });
        }
        if (sheetLiked) {
        const deleteSheetLike = await prisma.sheetLikes.delete({
            where: {
                id: sheetLiked.id
            }
        });
        if (!deleteSheetLike) {
            return new NextResponse('Could not remove like', { status: 500 });

            }

       }
        
    
    const likeSheet = await prisma.sheetDislikes.create({
        data: {
            sheetId,
            userId: currentUser.id
        }
    });
    if (!likeSheet) {
        return new NextResponse('Could not dislike the sheet', { status: 500 });
    }
    return new NextResponse('DisLiked', { status: 200 });
    }
    catch (error) {
        console.log('Sheet_Like_Error', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
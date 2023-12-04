import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function PUT(req: Request, res: Response) {
    try {
        const { sheetId, status } = await req.json();
        if(!sheetId || !status) {
            return new NextResponse('Missing sheetId or status', { status: 400 });
        }
        const updateSheet = await prisma.sheet.update({
            where: {
                id: parseInt(sheetId)
            },
            data: {
                status
            }
        });
        if(!updateSheet) {
            return new NextResponse('Sheet update failed', { status: 400 });
        }
        await pusherServer.trigger('sheet', 'sheet:status', updateSheet.id);
        return NextResponse.json(updateSheet, { status: 200 });
            

    }
    catch (error) {
        console.log('Sheet_PUTTING_Error: ', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
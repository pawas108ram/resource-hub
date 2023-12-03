import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { sheetId: string } }) {
    try {
        const { sheetId } = params;
        const sheet = await prisma.sheet.findFirst({
            where: {
                id: parseInt(sheetId)
            },
            include: {
                author:true,
            }
        });
        if(!sheet) {
            return new NextResponse('Couldnt find SheetAuthor', { status: 404 });
        }
        return NextResponse.json(sheet.author, { status: 200 });


    }
    catch (error) {
        console.log('Error getting sheetAuthor: ', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
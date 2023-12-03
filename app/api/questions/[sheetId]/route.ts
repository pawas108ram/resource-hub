import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: {
    params: {
    sheetId:string
}}) {
    try {
        const { sheetId } = params;
        if(!sheetId) {
            return new NextResponse('Missing required fields', { status: 400 });
        }
        const questions = await prisma.question.findMany({
            where: {
                sheetId: parseInt(sheetId),
                folderId:null,
            }
        });
        if(!questions) {
            return new NextResponse('No Questions Found', { status: 404 });
        }
        return NextResponse.json(questions, { status: 200 });

    }
    catch (err) {
        console.log('Question Fetch Error: ', err);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
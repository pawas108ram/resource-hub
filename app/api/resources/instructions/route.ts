import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function PUT(req: Request, res: Response) {
    try {
        const { instructions, resourceId } = await req.json();
        if(!instructions || !resourceId) {
            return new NextResponse('Missing required fields', { status: 400 });
        }
        if (instructions.length > 10) {
            return new NextResponse('Too many instructions try to give no more than 10', { status: 400 });
        }
        const addInstructions = await prisma.resource.update({
            where: {
                id: parseInt(resourceId)
            },
            data: {
                instructions: instructions
            }
        });
        if(!addInstructions) {
            return new NextResponse('Error in adding instructions', { status: 500 });
        }
        return new NextResponse('Instructions added successfully', { status: 200 });
    }
    catch (error) {
        console.log('Instructions Error: ', error);
        return new NextResponse('Instructions Error', { status: 500 });
    }
}
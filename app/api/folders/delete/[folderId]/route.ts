import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { folderId: string } }) {
    try {
        const { folderId } = params;
        if (!folderId) {
            return new NextResponse('Missing required fields', { status: 400 });
        }
        const folder = await prisma.folder.delete({
            where: {
                id: parseInt(folderId),
            },
        });
        if (!folder) {
            return new NextResponse('Folder Deletion Failed', { status: 500 });
        }
        await pusherServer.trigger('folder','delete:folder',folder.id)
        return new NextResponse('Folder Deleted Successfully', { status: 200 });
    }
    catch (err) {
        console.log('Folder Deletion Error: ', err);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
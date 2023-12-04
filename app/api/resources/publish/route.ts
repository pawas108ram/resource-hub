import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function PUT(req: Request, res: Response) {
    try {
        const { resourceId, status } = await req.json();
        if(!resourceId || !status) {
            return new NextResponse('Missing sheetId or status', { status: 400 });
        }
        const updateResource = await prisma.resource.update({
            where: {
                id: parseInt(resourceId)
            },
            data: {
                status
            }
        });
        if(!updateResource) {
            return new NextResponse('Sheet update failed', { status: 400 });
        }
        await pusherServer.trigger('resource', 'resource:status', updateResource.id);
        return NextResponse.json(updateResource, { status: 200 });
            

    }
    catch (error) {
        console.log('Resource_PUTTING_Error: ', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
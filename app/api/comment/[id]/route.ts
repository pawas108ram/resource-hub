import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        if(!id){
            return new NextResponse('Unauthorized', { status: 401 });
        }
        const deleteComment = await prisma.comment.delete({
            where:{
                id: parseInt(id)
            }
        });
        if(!deleteComment){
            return new NextResponse('Comment could not be deleted', { status: 500 });
        }
        pusherServer.trigger('comment', 'delete:comment', deleteComment.id);
        return NextResponse.json(deleteComment, { status: 200 });

    }
    catch (error: any) {
        console.log('Sheet_Deletion_Error: ', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
    
}
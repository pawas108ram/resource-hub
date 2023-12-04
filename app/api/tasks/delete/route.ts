import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, res: Response) {
    try {
        const { taskId } = await req.json();
        if (!taskId) {
            return new NextResponse('Missing task id', { status: 400 });
        }
        const deleteTask = await prisma.task.delete({
            where: {
                id: parseInt(taskId)
            }
        });
        if(!deleteTask){
            return new NextResponse('Task not found', { status: 404 });
        }
        await pusherServer.trigger('task','delete:task',deleteTask.id)
        return new NextResponse('Task Deleted', { status: 200 });
    }
    catch (error) {
        console.log(error);
        return new NextResponse('There was a error in deleting the task', { status: 500 });
    }
}
import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { TaskStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PUT(req: Request, res: Response) {
    try {
        const { status, taskId,resourceId } = await req.json();
        console.log(status, taskId);
        const currentUser = await getCurrentUser();
        if (!currentUser || !currentUser.id) {
            return new NextResponse('User not found', { status: 404 });
        }
        if(!status || !taskId) {
            return new NextResponse('Missing required fields', { status: 400 });
        }
        const existingTaskUser = await prisma.taskUserStatus.findFirst({
            where: {
                taskId: parseInt(taskId),
                userId: currentUser.id
            }
        });
        if (!existingTaskUser) {
            const addTaskUser = await prisma.taskUserStatus.create({
                data: {
                    status: status as TaskStatus,
                    taskId: parseInt(taskId),
                    userId: currentUser.id
                }
            });
            if(!addTaskUser) {
                return new NextResponse('Error in adding task status', { status: 500 });
            }
            pusherServer.trigger('task', 'task:status', addTaskUser);
            return new NextResponse('Task status added successfully', { status: 200 });
        }
        const updateTaskUser = await prisma.taskUserStatus.update({
            where: {
                userId: currentUser.id,
                taskId: parseInt(taskId),
                id: existingTaskUser.id
            }
                
            ,
            data: {
                status: status as TaskStatus
            },
            
        });
        if(!updateTaskUser) {
            return new NextResponse('Error in updating task status', { status: 500 });
        }
        const allTasks = await prisma.task.findMany({
            where: {
                resourceId: parseInt(resourceId)
            },
            include: {
                taskStatus: {
                    where: {
                        userId: currentUser.id
                    
                    }
                },
                questionLinks: true,
                fileLinks: true,
                imageLinks: true,
                videoLinks: true,
                websiteLinks: true,
            }
        });
        pusherServer.trigger('task', 'task:status', allTasks);
        console.log(updateTaskUser);
        
        return new NextResponse('Task status updated successfully', { status: 200 });
            
        

    }
    catch (error) {
        console.log('Task Status Error: ', error);
        return new NextResponse('Task Status Error', { status: 500 });
    }
}
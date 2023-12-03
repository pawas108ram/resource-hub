import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function PUT(req: Request, res: Response) {
    try {
        const { title, description, taskId, questionLinks, fileLinks, websiteLinks, videoLinks, imageLinks } = await req.json();
        const currentUser = await getCurrentUser();
        if (!currentUser || !currentUser.id) {
            return new NextResponse('Unauthorised', { status: 401 });
        }
        if(!title || !description || !taskId) {
            return new NextResponse('Missing required fields', { status: 400 });
        }
        if (questionLinks.length > 10) {
            return new NextResponse('Too many questions', { status: 400 });
        }
        if (fileLinks.length > 10) {
            return new NextResponse('Too many files', { status: 400 });
        }
        if (websiteLinks.length > 5) {
            return new NextResponse('Too many websites', { status: 400 });
        }
        if (videoLinks.length > 5) {
            return new NextResponse('Too many videos', { status: 400 });
        }
        if (imageLinks.length > 5) {
            return new NextResponse('Too many images', { status: 400 });
        }


        const deleteQuestions = await prisma.questionLinks.deleteMany({
            where: {
                taskId: taskId
            }
        
        });
        const deleteFiles = await prisma.fileLinks.deleteMany({
            where: {
                taskId: taskId
            }
        
        });
        const deleteWebsites = await prisma.websiteLinks.deleteMany({
            where: {
                taskId: taskId
            }
        
        });
        const deleteVideos = await prisma.videoLinks.deleteMany({
            where: {
                taskId: taskId
            }
        
        });
        const deleteImages = await prisma.imageLinks.deleteMany({
            where: {
                taskId: taskId
            }
        
        });
        const updatedTask = await prisma.task.update({
            where: {
                id: taskId
            },
            data: {
                title,
                description,
                questionLinks: {
                    createMany: {
                        data: questionLinks?questionLinks.map((questionLink: any) => {
                            return {
                                link: questionLink.link,
                                title: questionLink.title,
                            }
                        }):[]
                    }
                },
                fileLinks: {
                    createMany: {
                        data: fileLinks?fileLinks.map((fileLink: any) => {
                            return {
                                link: fileLink.link,
                                title: fileLink.title,
                            }
                        }):[]
                    }
                },
                websiteLinks: {
                    createMany: {
                        data: websiteLinks?websiteLinks.map((websiteLink: any) => {
                            return {
                                link: websiteLink.link,
                                title: websiteLink.title,
                            }
                        }):[]
                    }
                },
                videoLinks: {
                    createMany: {
                        data: videoLinks?videoLinks.map((videoLink: any) => {
                            return {
                                link: videoLink.link,
                                title: videoLink.title,
                            }
                        }):[]
                    }
                },
                imageLinks: {
                    createMany: {
                        data: imageLinks?imageLinks.map((imageLink: any) => {
                            return {
                                link: imageLink.link,
                                title: imageLink.title,
                            }
                        }):[]
                    }
                },
            },
            include: {
                questionLinks: true,
                fileLinks: true,
                imageLinks: true,
                websiteLinks: true,
                videoLinks: true,
                taskStatus: {
                    where: {
                        userId:currentUser.id
                    }
                }
            }
            
            
            
        });
        if(!updatedTask ) {
            return new NextResponse('Task Update Error', { status: 500 });
        }
        pusherServer.trigger('task', 'update:task', updatedTask);
        return new NextResponse('Task Updated Successfully', { status: 200 });
    }
    catch (error) {
        console.log('Task Update Error: ', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
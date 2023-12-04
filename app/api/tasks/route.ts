import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
    try {
        const body = await req.json();
       
        const { title, description, expectedDuration, questionLinks, fileLinks, imageLinks, videoLinks, websiteLinks, resourceId } = body;
        const currentUser = await getCurrentUser();
        if (!currentUser || !currentUser.id) {
            return new NextResponse('Unauthorised', { status: 401 });
        }
        
       if(!title || !description || !expectedDuration || !resourceId){
           return new NextResponse('Missing Vital Informations',{status:400});
       }
        const task = await prisma.task.create({
           
            data: {
                resourceId:parseInt(resourceId),
                
               
                        title,
                        description,
                        expectedDuration,

                        
                        questionLinks: {
                            createMany: {
                                data: questionLinks ? questionLinks.map((links: { link: string, title: string }) => ({
                                    link: links.link,
                                    title: links.title
                                })) : []
                               
                            }
                        },
                        fileLinks: {
                            createMany: {
                                data: fileLinks ? fileLinks.map((links: { link: string, title: string }) => ({
                                    link: links.link,
                                    title: links.title
                                })) : []
                               
                            }
                        },
                        imageLinks: {
                            createMany: {
                                data: imageLinks ? imageLinks.map((links: { link: string, title: string }) => ({
                                    link: links.link,
                                    title: links.title
                                })) : []
                               
                            }
                        },
                        videoLinks: {
                            createMany: {
                                data: videoLinks ? videoLinks.map((links: { link: string, title: string }) => ({
                                    link: links.link,
                                    title: links.title
                                })) : []
                               
                            }
                        },
                        websiteLinks: {
                            createMany: {
                                data: websiteLinks ? websiteLinks.map((links: { link: string, title: string }) => ({
                                    link: links.link,
                                    title: links.title
                                })) : []
                               
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
        
        if (!task) {
            return new NextResponse('Something went wrong', { status: 500 });
        }
        await pusherServer.trigger(`resource-${resourceId}`,'create:task', task);
        
        return new NextResponse('Task Created Successfully', { status: 201 });
    }
    catch (error) {
        console.log(error);
        return new NextResponse('Something went wrong', { status: 500 });
    }
}
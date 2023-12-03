import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function PUT(req: Request, res: Response) {
    try {
        const { title, description, folderId, questions } = await req.json();
        const currentUser = await getCurrentUser();
        if (!currentUser || !currentUser.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        
        if(!title || !description || !folderId || !questions) {
            return new NextResponse('Missing required fields', { status: 400 });
        }
        console.log(title, description, folderId, questions);
        if(title.length>100){
            return new NextResponse('Title too long', { status: 400 });
        }
        if(description.length>500){
            return new NextResponse('Description too long', { status: 400 });
        }
        if(questions.length>100){
            return new NextResponse('Too many questions', { status: 400 });
        }
        const updatedFolder = await prisma.folder.update({
            where: {
                id: folderId
            },
            data: {
                title,
                description,
            }
        });
        if(!updatedFolder ) {
            return new NextResponse('Folder Update Error', { status: 500 });
        }
        const folderInitialQuestions = await prisma.question.updateMany({ 
            where: {
                folderId: folderId
            },
            data: {
                folderId: null
            }
        });
        const folderQuestions = await prisma.question.updateMany({
            where: {
                id: {
                    in: questions,
                    
                }
            },
            data: {
                folderId: folderId
            }
            
            
            
        });
        if (updatedFolder.id) {
            const folderSheet = await prisma.sheet.findFirst({
                where: {
                    folders: {
                        some: {
                            id: updatedFolder.id
                        }
                    },
                    OR: [
                        {
                          authorId: currentUser.id,
                        },
                        {
                          users: {
                            some: {
                              userId: currentUser.id,
                            },
                          },
                        },
                      ],
                },
             
                   
                 
            
                  include: {
                    author: true,
                    questions: {
                      where: {
                        folderId: null,
                      },
                     
                      include: {
                        likes: true,
                        dislikes: true,
                        solutions: true,
                        questionStatus: {
                          where: {
                            userId: currentUser.id,
                          },
            
                          include: {
                            user: true,
                          },
                        },
                      },
                    },
                    folders: {
                      include: {
                        questions: {
                          where: {
                            folderId: {
                              not: null,
                            },
                          },
                         
                          include: {
                            likes: true,
                            dislikes: true,
                            solutions: true,
                            questionStatus: {
                              where: {
                                userId: currentUser.id,
                              },
                              include: {
                                user: true,
                              },
                            },
                          },
                        },
                      },
                    },
                    users: {
                      include: {
                        user: true,
                      },
                    },
                  },

            });
            pusherServer.trigger('folder','update:folder',folderSheet);
        }
        

        if(!folderQuestions && !folderInitialQuestions ) {
            return new NextResponse('Folder Update Error', { status: 500 });
        }
        return new NextResponse('Folder Updated Successfully', { status: 200 });
    }
    catch (error) {
        console.log('Folder Update Error: ', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
    try {
        const { title, sheetId, description, questions } = await req.json();
        const currentUser = await getCurrentUser();
        if (!currentUser || !currentUser.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        if(!title || !sheetId || !description || !questions) {
            return new NextResponse('Missing required fields', { status: 400 });
        }
        if (title.length === 0) {
            return new NextResponse('Title cannot be empty', { status: 400 });
        }
        if (description.length === 0) {
            return new NextResponse('Description cannot be empty', { status: 400 });
        }
       
        if (title.length > 100) {
            return new NextResponse('Title cannot be more than 100 characters', { status: 400 });
        }
        console.log(title, questions, sheetId, description);

        const folder = await prisma.folder.create({
            data: {
                title,
                description,
                
                sheetId: parseInt(sheetId),
               
               
            }
        });

        const folderQuestions = await prisma.question.updateMany({
            where: {
                id: {
                    in: questions
                }
            },
            data: {
                folderId: folder.id
            }
        });
        const sheet = await prisma.sheet.findUnique({
            where: {
              id: parseInt(sheetId),
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
        await pusherServer.trigger('folder','create:folder',sheet);

        

        if(!folder ) {
            return new NextResponse('Folder Creation Error', { status: 500 });
        }
        

        return new NextResponse('Folder Created Successfully', { status: 200 });
    }
    catch (error) {
        console.log('Folder CreationError: ', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
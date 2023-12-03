import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
    try {
        const { title, links, difficulty, tags, sheetId, folderId } = await req.json();
        const currentUser = await getCurrentUser();
        if (!currentUser || !currentUser.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        console.log(title, links, difficulty, tags);
        if(!title || !links || !difficulty || !tags || !sheetId) {
            return new NextResponse('Missing required fields', { status: 400 });
        }
        if (title.length === 0) {
            return new NextResponse('Title cannot be empty', { status: 400 });
        
        }
        if (links.length === 0) {
            return new NextResponse('Links cannot be empty', { status: 400 });
        }
        if (difficulty.length === 0) {
            return new NextResponse('Difficulty cannot be empty', { status: 400 });
        }
        if (tags.length === 0) {
            return new NextResponse('Tags cannot be empty', { status: 400 });
        }
        if (title.length > 100) {
            return new NextResponse('Title cannot be more than 100 characters', { status: 400 });
        }
        if (!folderId) {
            
        
        
            const question = await prisma.question.create({
                data: {
                    title: title,
                    links: links,
                    difficulty: difficulty,
                    tags: tags,
                    sheetId: sheetId

                },
                include: {
                    likes: true,
                    dislikes: true,
                    solutions: true,
                    questionStatus: {
                        where: {
                            userId: currentUser.id
                        }
                    }

                }
            });
            if(!question) {
                return new NextResponse('Question Creation Failed', { status: 500 });
            }
            pusherServer.trigger('question', 'create:question', question);
            
            

            return new NextResponse('Question Created Successfully', { status: 200 });
        }
        const folderQuestion = await prisma.question.create({
            data: {
                title: title,
                links: links,
                difficulty: difficulty,
                tags: tags,
                sheetId: sheetId,
                folderId: folderId

            },
            include: {
                likes: true,
                dislikes: true,
                solutions: true,
                questionStatus: {
                    where: {
                        userId: currentUser.id
                    }
                }
            }
        });
        if (!folderQuestion) {
            return new NextResponse('Question Creation Failed', { status: 500 });
        }

    
        pusherServer.trigger('question', 'create:folderquestion', folderQuestion);
        pusherServer.trigger('folder', 'create:folderquestion', parseInt(sheetId));
        return new NextResponse('Folder Question Created Successfully', { status: 200 });

        
    }
    catch (err) {
        console.log('Question Creation Error: ', err);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(req:Request,res:Response){
    try {
        const body = await req.json();
    const { resourceId } = body;
    const currentUser = await getCurrentUser();
    if(!currentUser || !currentUser.id){
        return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!resourceId) {
        return new NextResponse('Bad Request', { status: 400 });
    }
    const resourceLiked = await prisma.resourceLikes.findFirst({
        where: {
            resourceId,
            userId: currentUser.id

        }
    });
        const resourceDisliked = await prisma.resourceDislikes.findFirst({
        where: {
            resourceId,
            userId: currentUser.id

            }
        });
        if (resourceDisliked) {
            return new NextResponse('resource Already Disliked', { status: 400 });
        }
        if (resourceLiked) {
        const deleteresourceLike = await prisma.resourceLikes.delete({
            where: {
                id: resourceLiked.id
            }
        });
        if (!deleteresourceLike) {
            return new NextResponse('Could not remove like', { status: 500 });

            }

       }
        
    
    const likeresource = await prisma.resourceDislikes.create({
        data: {
            resourceId,
            userId: currentUser.id
        }
    });
    if (!likeresource) {
        return new NextResponse('Could not dislike the resource', { status: 500 });
    }
    return new NextResponse('DisLiked', { status: 200 });
    }
    catch (error) {
        console.log('resource_Like_Error', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
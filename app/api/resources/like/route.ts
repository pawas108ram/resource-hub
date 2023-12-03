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
        const deleteresourceDislike = await prisma.resourceDislikes.delete({
            where: {
                id: resourceDisliked.id
            }
        });
        if (!deleteresourceDislike) {
            return new NextResponse('Could not remove dislike', { status: 500 });

            }
        }

    if (resourceLiked) {
        return new NextResponse('resource Already Liked', { status: 400 });

    }
    const likedresource = await prisma.resourceLikes.create({
        data: {
            resourceId,
            userId: currentUser.id
        }
    });
    if (!likedresource) {
        return new NextResponse('Could not like the resource', { status: 500 });
    }
    return new NextResponse('Liked', { status: 200 });
    }
    catch (error) {
        console.log('resource_Like_Error', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
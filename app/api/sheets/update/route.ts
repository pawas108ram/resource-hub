import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server"

export async function PUT(req:Request,res:Response){
try{
    const { title, description, isPublic, sheetId } = await req.json();
    if(!sheetId){
        return new NextResponse('Unauthorized', { status: 401 });
    }
    const updatedSheet = await prisma.sheet.update({
        where:{
            id: sheetId
        },
        data:{
            title,
            description,
            isPublic
        },
        include: {
            dilikes: true,
            author: true,
            likes: true,
            users:true
            
        }
    });
    if(!updatedSheet){
        return new NextResponse('Sheet could not be updated', { status: 500 });
    }
    pusherServer.trigger(`sheet`, 'update:sheet', updatedSheet);
    return NextResponse.json(updatedSheet, { status: 200 });


    
}
catch(error:any){
    console.log('Sheet Update Error: ', error)
    return new NextResponse('Internal Server Error', { status: 500 });

}
}
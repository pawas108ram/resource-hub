
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, res:Response) {
    try {
        const { searchParams } = new URL(req.url);
        const page = searchParams.has('page') ? searchParams.get('page') : "1";
        
        
        
        
        
        
        
        const leaderBoardUsers = await prisma.user.findMany({
            take: 10,
            skip: (parseInt(page!)-1)*10,
            orderBy: [
                {  
                    keys: 'desc'
                },
                {
                    coins: 'desc'

                },
               
            ]
        });
        if (!leaderBoardUsers) return new NextResponse('Leaderboard Fetch Failed', { status: 400 });
        return NextResponse.json(leaderBoardUsers, { status: 201 });

        
    }
    catch (error) {
        console.log('Leaderboard_Error: ', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
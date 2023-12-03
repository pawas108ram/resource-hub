import bcrypt from 'bcrypt';
import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';
export async function POST(request: Request, response: Response) {
    try {
        const body = await request.json();
        const { username, email, password } = body;
        if (!username || !email || !password) {
            return new NextResponse('Please enter all fields', { status: 400 });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const isExistingUser = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (isExistingUser) {
            return new NextResponse('User already exists', { status: 400 });
        }
        const user = await prisma.user.create({
            data: {
                name: username,
                email,
                hashedPassword
            }
        })
        return NextResponse.json(user, { status: 201 });
    }
    catch (error: any) {
        console.log(error, 'REGISTER ERROR');
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
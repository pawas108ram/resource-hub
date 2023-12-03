import prisma from "../libs/prismadb";

export const  getUserById=async(id:number)=> {
    try {
        const currentUser = await prisma.user.findFirst({
            where: {
                id: id
            }
        });
        console.log('currentUser: ', currentUser);
        if (!currentUser) {
            return null;
        }
        return currentUser;
    }
    catch (error) {
        console.log('getUserById_Error: ', error);
        return null;
    }
}
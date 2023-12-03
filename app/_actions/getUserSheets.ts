import prisma from "../libs/prismadb";
import { getCurrentUser } from "./getCurrentUser";

export const getUserSheets=async()=> {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser || !currentUser.id) {
            return [];
        }
        const userSheets = await prisma.sheet.findMany({
            where: {
                AND: [
                    {
                        users: {
                            some: {
                                userId: currentUser.id
                            }
                        }
                    }, {
                        NOT: {
                            authorId: currentUser.id
                        
                    }}
                ]
            }
        })
        if (!userSheets) {
            return [];
        }
        return userSheets;
    }
    catch (error) {
        console.log('getUserSheets_Error: ', error);
        return [];
    }
}
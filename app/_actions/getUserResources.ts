import prisma from "../libs/prismadb";
import { getCurrentUser } from "./getCurrentUser";

export const getUserResources=async()=> {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser || !currentUser.id) {
            return [];
        }
        const userResources = await prisma.resource.findMany({
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
        if (!userResources) {
            return [];
        }
        return userResources;
    }
    catch (error) {
        console.log('getUserResources_Error: ', error);
        return [];
    }
}
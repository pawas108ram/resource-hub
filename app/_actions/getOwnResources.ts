import prisma from "../libs/prismadb";
import { getCurrentUser } from "./getCurrentUser";

export const  getOwnResources=async()=> {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser
            || !currentUser.id) {
            return [];
        }
        const resources = await prisma.resource.findMany({
            where: {
                authorId:currentUser.id,
            }
        })
        if(!resources){
            return [];
        }   
        return resources;
        
    }
    catch (error) {
        return [];
    }
}
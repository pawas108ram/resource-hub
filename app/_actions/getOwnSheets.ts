import prisma from "../libs/prismadb";
import { getCurrentUser } from "./getCurrentUser";
export const  getOwnSheets=async()=> {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser || !currentUser.id) {
            return [];
        }
        const sheets = await prisma.sheet.findMany({
            where: {
                authorId:currentUser.id,
                
            },
            
           
        })
        if(!sheets){
            return [];
        }
        return sheets;
    }
    catch (error) {
        return [];
    }
}
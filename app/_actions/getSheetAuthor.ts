import { baseUrl } from "./getAllSolutions";

export const getSheetAuthor=async(sheetId: string)=> {
    const url = baseUrl();
    const res = await fetch(url+'/api/users/' + sheetId);
    if (res.status === 200) {
        const author = await res.json();
        return author;
    }
    else {
        return null;
    }
}
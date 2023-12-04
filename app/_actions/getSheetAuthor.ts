

export const getSheetAuthor=async(sheetId: string)=> {
    
    const res = await fetch('/api/users/' + sheetId);
    if (res.status === 200) {
        const author = await res.json();
        return author;
    }
    else {
        return null;
    }
}
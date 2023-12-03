export function dateString(date: Date) {
    const now = new Date();
    const sameMonth = now.getMonth() === date.getMonth();
    if (!sameMonth) {
        return `${now.getMonth() - date.getMonth()} months ago`;
        
    }
    if (sameMonth) {
        const sameDay = now.getDate() === date.getDate();
        if (!sameDay) {
            if (now.getDate() - date.getDate() === 1) {
                return 'Yesterday';
            }
            return `${now.getDate() - date.getDate()} days ago`;
        }
        if (sameDay) {
            const sameHour = now.getHours() === date.getHours();
            if (!sameHour) {
                return `${now.getHours() - date.getHours()} hours ago`;
            }
            if (sameHour) {
                const sameMinute = now.getMinutes() === date.getMinutes();
                if (!sameMinute) {
                    return `${now.getMinutes() - date.getMinutes()} minutes ago`;
                }
                if (sameMinute) {
                    const sameSecond = now.getSeconds() === date.getSeconds();
                    if (!sameSecond) {
                        return `${now.getSeconds() - date.getSeconds()} seconds ago`;
                    }
                    if (sameSecond) {
                        return 'just now';
                    }
                }
            }
        }
    }
    

    
}
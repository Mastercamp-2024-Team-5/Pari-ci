// cookies.ts

export function setCookie(name: string, value: unknown): void {
    const serializedValue = JSON.stringify(value); // Serialize object to JSON string
    document.cookie = `${name}=${serializedValue}; path=/`;
}

export function getCookie(name: string): unknown {
    const cookieName = `${name}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');

    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(cookieName) === 0) {
            const cookieValue = cookie.substring(cookieName.length, cookie.length);
            try {
                return JSON.parse(cookieValue); // Deserialize JSON string to object
            } catch (error) {
                return cookieValue; // Return as-is if parsing fails
            }
        }
    }

    return null;
}

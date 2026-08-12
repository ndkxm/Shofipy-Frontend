
export const parseImages = (image) => {
    if (!image) return [];
    if (Array.isArray(image)) return image;
    try {
        const jsonStr = image
            .trim()
            .replace(/'/g, '"');
        const parsed = JSON.parse(jsonStr);
        return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
        // Fallback: extract URLs bằng regex
        const matches = image.match(/https?:\/\/[^\s'"]+/g);
        return matches ?? [];
    }
};
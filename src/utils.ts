/**
 * Extracts and normalizes a Wikipedia article title from a URL.
 */
function getNormalizedTitle(url: string): string {
    const parts = url.split("/wiki/");
    if (parts.length < 2) {
        throw new Error(`Invalid Wikipedia URL: ${url}`);
    }
    // Decode and convert underscores to spaces
    return decodeURIComponent(parts[1]).replace(/_/g, " ").trim();
}

/**
 * Compares two Wikipedia article URLs to see if they point to the same article.
 */
export function areArticlesTheSame(urlA: string, urlB: string): boolean {
    const titleA = getNormalizedTitle(urlA).toLowerCase();
    const titleB = getNormalizedTitle(urlB).toLowerCase();
    return titleA === titleB;
}

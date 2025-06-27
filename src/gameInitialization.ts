import { StartGameMessageData } from "./background";

/**
 * Get a random Wikipedia article URL.
 */
export async function getRandomArticleUrl(): Promise<string> {
    const res = await fetch("https://en.wikipedia.org/wiki/Special:Random", { redirect: "follow" });
    return res.url;
}

/**
 * Extract the article title from a full Wikipedia URL.
 */
export function getTitleFromUrl(url: string): string {
    const parts = url.split("/wiki/");
    return decodeURIComponent(parts[1] || "");
}

/**
 * Get outgoing article URLs linked from a given Wikipedia page.
 */
export async function getOutgoingArticleUrls(articleUrl: string): Promise<string[]> {
    const articleTitle = getTitleFromUrl(articleUrl);

    const apiUrl = `https://en.wikipedia.org/w/api.php` +
        `?action=query&prop=links&pllimit=max&format=json&origin=*` +
        `&titles=${encodeURIComponent(articleTitle)}`;

    const res = await fetch(apiUrl);
    const data = await res.json();

    const page = Object.values(data.query.pages)[0] as { links?: { title: string }[] };
    const links = page.links ?? [];

    return links
        .filter(link => !link.title.startsWith("List of") && !link.title.includes(":"))
        .map(link => `https://en.wikipedia.org/wiki/${encodeURIComponent(link.title)}`);
}

/**
 * Given a starting article, walk exactly `steps` random hops and return the ending article URL.
 */
export async function walkRandomPath(startUrl: string, steps: number): Promise<string> {
    const visited = new Set<string>();
    let currentUrl = startUrl;

    for (let i = 0; i < steps; i++) {
        visited.add(currentUrl);

        const links = await getOutgoingArticleUrls(currentUrl);
        const candidates = links.filter(url => !visited.has(url));

        if (candidates.length === 0) {
            throw new Error(`Dead end after ${i} steps at ${currentUrl}`);
        }

        currentUrl = candidates[Math.floor(Math.random() * candidates.length)];
    }

    return currentUrl;
}

/**
 * Get a random start and end article URL, where the end is 5–8 steps away.
 */
export async function getRandomStartAndEnd(): Promise<StartGameMessageData> {
    let startingArticleUrl = await getRandomArticleUrl();
    let endingArticleUrl: string;
    let minSteps = 0;

    while (true) {
        try {
            minSteps = Math.floor(Math.random() * 3) + 3; // 3 to 5 inclusive
            endingArticleUrl = await walkRandomPath(startingArticleUrl, minSteps);
            break;
        } catch (err) {
            console.error(err);
            startingArticleUrl = await getRandomArticleUrl();
            console.log(`Retrying with new start article: ${startingArticleUrl}`);
        }
    }

    return {
        startingArticleUrl,
        endingArticleUrl,
        minSteps
    };
}

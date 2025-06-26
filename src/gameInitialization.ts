import { Game, type Article } from "./game"

export async function getRandomArticle(): Promise<Article> {
    const res = await fetch("https://en.wikipedia.org/wiki/Special:Random", { redirect: "follow" });
    const url = res.url;
    return {
        title: decodeURIComponent(url.split("/").pop() || ""),
        url
    }
}

export async function getOutgoingArticles(article: Article): Promise<Article[]> {
    const url = `https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&prop=links&titles=${encodeURIComponent(article.title)}&pllimit=max`;
    const res = await fetch(url);
    const data = await res.json();
    const page = Object.values(data.query.pages)[0] as { links?: { title: string }[] };
    const links = page.links || [];

    return links
        .filter(link => !link.title.startsWith("List of") && !link.title.includes(":"))
        .map(link => ({ title: link.title, url: `https://en.wikipedia.org/wiki/${encodeURIComponent(link.title)}` }));
}

export async function getPathOfExactLength(startarticle: Article, steps: number): Promise<Article> {
    const visited = new Set<Article>();
    let currentArticle = startarticle;

    for (let i = 0; i < steps; i++) {
        visited.add(currentArticle);
        const links = await getOutgoingArticles(currentArticle);
        const candidates = links.filter(link => !Array.from(visited).map(article => article.title).includes(link.title));

        if (candidates.length === 0) {
            throw new Error(`Dead end at step ${i} from ${currentArticle.title}`);
        }

        currentArticle = candidates[Math.floor(Math.random() * candidates.length)];
    }

    return currentArticle;
}

export async function getCurrentGameOrCreateNew(): Promise<Game> {
    const game = new Game();

    try {
        game.ParseGameData(await chrome.storage.local.get(["gameData"]));
        console.log("Game data loaded successfully.");
    } catch (error) {
        console.error("Error loading game data:", error);
        game.ResetGame();

        game.startingArticle = await getRandomArticle();
        while (true) {
            try {
                game.endingArticle = await getPathOfExactLength(game.startingArticle, game.totalSteps);
                break;
            } catch (error) {
                console.error(error);
                game.startingArticle = await getRandomArticle();
                console.log(`Retrying with new start article: ${game.startingArticle.title}`);
            }
        }
        game.currentArticle = game.startingArticle;
        game.stepsRemaining = game.totalSteps;
        game.stepsTaken = [];
        game.gameOver = false;
        await chrome.storage.local.set({ gameData: game.GetGameData() });
        console.log("New game initialized and saved.")
    }

    return game;
}

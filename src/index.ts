type Article = {
    title: string;
    url: string;
}

async function getRandomArticle(): Promise<Article> {
    const res = await fetch("https://en.wikipedia.org/wiki/Special:Random", { redirect: "follow" });
    const url = res.url;
    return {
        title: decodeURIComponent(url.split("/").pop() || ""),
        url
    }
}

async function getOutgoingArticles(article: Article): Promise<Article[]> {
    const url = `https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&prop=links&titles=${encodeURIComponent(article.title)}&pllimit=max`;
    const res = await fetch(url);
    const data = await res.json();
    const page = Object.values(data.query.pages)[0] as { links?: { title: string }[] };
    const links = page.links || [];

    return links
        .filter(link => !link.title.startsWith("List of") && !link.title.includes(":"))
        .map(link => ({ title: link.title, url: `https://en.wikipedia.org/wiki/${encodeURIComponent(link.title)}` }));
}

async function getPathOfExactLength(startarticle: Article, steps: number): Promise<Article> {
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

async function main(): Promise<void> {
    const loading = document.getElementById("loading") as HTMLElement;
    const content = document.getElementById("content") as HTMLElement;
    const startLink = document.getElementById("start-link") as HTMLAnchorElement;
    const endLink = document.getElementById("end-link") as HTMLAnchorElement;
    const stepsText = document.getElementById("steps") as HTMLElement;

    let usingStoredData = false;
    let startArticle: Article | null = null;
    let endArticle: Article | null = null;
    let stepCount = 5;

    const storedData = await chrome.storage.local.get(["startArticle", "endArticle", "numSteps"]);
    startArticle = storedData.startArticle ?? null;
    endArticle = storedData.endArticle ?? null;

    if (startArticle && endArticle) {
        console.log(`Using stored articles: ${startArticle} -> ${endArticle}`);
        //usingStoredData = true;
    }

    if (!usingStoredData) {
        console.log("No stored articles found, generating new path...");
        startArticle = await getRandomArticle();

        while (true) {
            try {
                endArticle = await getPathOfExactLength(startArticle, stepCount);
                break;
            } catch (error) {
                console.error(error);
                startArticle = await getRandomArticle();
                console.log(`Retrying with new start article: ${startArticle}`);
            }
        }

        await chrome.storage.local.set({
            startArticle,
            endArticle,
            numSteps: stepCount
        });
    }

    if (startArticle && endArticle) {
        startLink.href = startArticle.url;
        startLink.textContent = startArticle.title;
        endLink.href = endArticle.url;
        endLink.textContent = endArticle.title;
        stepsText.textContent = `In ${stepCount} steps`;

        loading.style.display = "none";
        content.style.display = "block";
    }
}

main().catch(console.error);

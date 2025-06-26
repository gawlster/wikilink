import { getCurrentGameOrCreateNew } from "./gameInitialization";

async function main(): Promise<void> {
    const loading = document.getElementById("loading") as HTMLElement;
    const content = document.getElementById("content") as HTMLElement;
    const startLink = document.getElementById("start-link") as HTMLAnchorElement;
    const endLink = document.getElementById("end-link") as HTMLAnchorElement;
    const stepsText = document.getElementById("steps") as HTMLElement;
    const game = await getCurrentGameOrCreateNew();

    startLink.href = game.startingArticle?.url || "";
    startLink.textContent = game.startingArticle?.title || "";
    endLink.href = game.endingArticle?.url || "";
    endLink.textContent = game.endingArticle?.title || "";
    stepsText.textContent = `In ${game.totalSteps} steps`;

    loading.style.display = "none";
    content.style.display = "block";
}

main().catch(console.error);

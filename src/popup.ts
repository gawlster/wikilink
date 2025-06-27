import { getRandomStartAndEnd } from "./gameInitialization";

async function main(): Promise<void> {
    const loading = document.getElementById("loading") as HTMLElement;
    const content = document.getElementById("content") as HTMLElement;
    const startButton = document.getElementById("start-button") as HTMLAnchorElement;
    const endButton = document.getElementById("end-button") as HTMLAnchorElement;
    const stepsText = document.getElementById("steps") as HTMLElement;

    const gameInProgress = await chrome.storage.local.get("gameInProgress");
    if (gameInProgress.gameInProgress) {
        console.log("Game in progress")
        return;
    }

    const gameData = await getRandomStartAndEnd();

    startButton.textContent = decodeURIComponent(gameData.startingArticleUrl.split("/").pop() || "");
    endButton.textContent = decodeURIComponent(gameData.endingArticleUrl.split("/").pop() || "");
    stepsText.textContent = `Best score: ${gameData.minSteps} steps`;

    startButton.addEventListener("click", () => {
        chrome.runtime.sendMessage({
            type: "OpenStartArticle",
            gameData
        })
    });

    loading.style.display = "none";
    content.style.display = "block";
}

main().catch(console.error);

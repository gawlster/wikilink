import { getRandomStartAndEnd, getTitleFromUrl } from "./gameInitialization";
import "./components";

async function populateStateToHTML() {
    const stepsTakenState = await chrome.storage.local.get("stepsTaken");
    const stepsTaken = stepsTakenState.stepsTaken || 0;
    const stepsTakenElements = document.getElementsByClassName("steps-taken");
    for (const element of stepsTakenElements) {
        if (element instanceof HTMLElement) {
            element.textContent = stepsTaken.toString();
        }
    }

    const startPageState = await chrome.storage.local.get("startingArticleUrl");
    const startPage = startPageState.startingArticleUrl || "Unknown";
    const startPageElements = document.getElementsByClassName("start-page");
    for (const element of startPageElements) {
        if (element instanceof HTMLElement) {
            element.textContent = getTitleFromUrl(startPage) || "Unknown";
            element.style.fontWeight = "bold";
        }
    }

    const endPageState = await chrome.storage.local.get("endingArticleUrl");
    const endPage = endPageState.endingArticleUrl || "Unknown";
    const endPageElements = document.getElementsByClassName("end-page");
    for (const element of endPageElements) {
        if (element instanceof HTMLElement) {
            element.textContent = getTitleFromUrl(endPage) || "Unknown";
            element.style.fontWeight = "bold";
        }
    }

    const minStepsState = await chrome.storage.local.get("minSteps");
    const minSteps = minStepsState.minSteps || 0;
    const minStepsElements = document.getElementsByClassName("min-steps");
    for (const element of minStepsElements) {
        if (element instanceof HTMLElement) {
            element.textContent = minSteps.toString();
        }
    }
}

async function main(): Promise<void> {
    const loading = document.getElementById("loading") as HTMLElement;
    const won = document.getElementById("won") as HTMLElement;
    const gameInProgress = document.getElementById("game-in-progress") as HTMLElement;
    const noGameInProgress = document.getElementById("no-game-in-progress") as HTMLElement;

    await populateStateToHTML();
    const startGameButtons = document.getElementsByClassName("start-game-button");
    for (const button of startGameButtons) {
        console.log(button)
        if (button instanceof HTMLButtonElement) {
            console.log("Adding click listener to button");
            button.addEventListener("click", async () => {
                console.log("Start game button clicked");
                const gameData = await getRandomStartAndEnd();
                chrome.runtime.sendMessage({
                    type: "OpenStartArticle",
                    gameData
                })
            });
        }
    }

    const hasWonState = await chrome.storage.local.get("hasWon");
    const gameInProgressState = await chrome.storage.local.get("gameInProgress");

    if (hasWonState.hasWon) {
        won.style.display = "block";
    } else if (gameInProgressState.gameInProgress) {
        gameInProgress.style.display = "block";
    } else {
        noGameInProgress.style.display = "block";
    }

    loading.style.display = "none";
}

// main().catch(console.error);

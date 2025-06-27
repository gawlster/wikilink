import { areArticlesTheSame } from "./utils";

let gameInProgress = false;
let currentTabId = -1;
let startingArticleUrl = "";
let endingArticleUrl = "";
let minSteps = -1;
let stepsTaken = 0;
let hasWon = false;

export type StartGameMessageData = {
    startingArticleUrl: string;
    endingArticleUrl: string;
    minSteps: number;
}

function isValidStartGameMessageData(gameData: any): gameData is StartGameMessageData {
    return (
        typeof gameData === "object" &&
        gameData !== null &&
        "startingArticleUrl" in gameData &&
        "endingArticleUrl" in gameData &&
        "minSteps" in gameData &&
        typeof gameData.startingArticleUrl === "string" &&
        gameData.startingArticleUrl !== "" &&
        typeof gameData.endingArticleUrl === "string" &&
        gameData.endingArticleUrl !== "" &&
        typeof gameData.minSteps === "number"
    );
}

async function resetGame(): Promise<void> {
    gameInProgress = false;
    startingArticleUrl = "";
    endingArticleUrl = "";
    minSteps = -1;
    stepsTaken = 0;
    currentTabId = -1;
    hasWon = false;
    await updateGameStorage();
}

async function updateGameStorage(): Promise<void> {
    await chrome.storage.local.set({
        gameInProgress,
        currentTabId,
        startingArticleUrl,
        endingArticleUrl,
        minSteps,
        stepsTaken,
        hasWon
    })
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.type === "OpenStartArticle") {
        const { gameData } = message;
        if (!isValidStartGameMessageData(gameData)) {
            console.error("Invalid message format for starting a game.");
            return;
        }
        startingArticleUrl = gameData.startingArticleUrl;
        endingArticleUrl = gameData.endingArticleUrl;
        minSteps = gameData.minSteps;
        stepsTaken = -1; // Start at -1 to count the first step as 0
        gameInProgress = true;
        hasWon = false;
        await updateGameStorage();
        chrome.tabs.create({ url: startingArticleUrl }, async (tab) => {
            if (chrome.runtime.lastError) {
                console.error("Error opening tab:", chrome.runtime.lastError);
                await resetGame();
            } else {
                currentTabId = tab.id || -1;
                chrome.notifications.create({
                    type: "list",
                    iconUrl: "../icon.png",
                    title: "Game Started",
                    message: "You have started a new game! Here are the rules:",
                    items: [
                        { title: "1", message: "Navigate by clicking links only." },
                        { title: "2", message: "Reach the target article in the least steps." },
                        { title: "3", message: "You may open another tab for information." },
                        { title: "4", message: "Once you reach the target article, you win!" },
                        { title: "5", message: "Closing the game tab ends the game." }
                    ]
                });
            }
        });
    } else {
        console.error("No URL provided in message.");
    }
});

chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
    if (hasWon) {
        return;
    }
    if (tabId === currentTabId) {
        chrome.notifications.create({
            type: "basic",
            iconUrl: "../icon.png",
            title: "Game Over",
            message: "You have closed the game tab. The game has ended. You may start a new game from the extension popup."
        })
        await resetGame();
    }
});

chrome.webNavigation.onCommitted.addListener(async (details) => {
    if (hasWon || details.tabId !== currentTabId) {
        return;
    }
    if (details.transitionType !== "link") {
        chrome.notifications.create({
            type: "basic",
            iconUrl: "../icon.png",
            title: "Invalid Navigation",
            message: "Game over! You may only navigate via links within the game tab. Please start a new game from the extension popup."
        });
        await resetGame();
        return;
    }
    stepsTaken++;
    const newUrl = details.url;
    if (areArticlesTheSame(newUrl, endingArticleUrl)) {
        chrome.notifications.create({
            type: "basic",
            iconUrl: "../icon.png",
            title: "Congratulations!",
            message: `You have reached the target article: ${decodeURIComponent(newUrl.split("/").pop() || "")}. You win!`
        });
        hasWon = true;
    }
    await updateGameStorage();
});

import { AuthStorage, getAuthStorage } from "./authStorage";
import { validateWin } from "./communication";
import { clearGameStorage, GameStorage, getGameStorage, updateGameStorage } from "./gameStorage";
import { closedTabNotification, gameStartedNotification, gameWonNotification, invalidGameNotification } from "./notifications";
import { isValidActiveGame } from "./serverTypes";
import { areArticlesTheSame } from "./utils";

let currentGameStorage: GameStorage = {
    id: "",
    startingArticleUrl: "",
    endingArticleUrl: "",
    minSteps: -1,
    visitedUrls: [],
    hasWon: false,
    tabId: -1
}

let currentAuthStorage: AuthStorage = {
    accessToken: "",
    refreshToken: "",
}

async function refetchAndSetStorage(): Promise<void> {
    const gameStorage = await getGameStorage();
    const authStorage = await getAuthStorage();
    currentGameStorage = gameStorage;
    currentAuthStorage = authStorage;
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    await refetchAndSetStorage();
    switch (message.type) {
        case "gameStarted":
            const { game } = message;
            if (!isValidActiveGame(game)) {
                console.error("Invalid message format for starting a game.");
                return;
            }
            chrome.tabs.create({ url: game.startingArticleUrl }, async (tab) => {
                if (chrome.runtime.lastError) {
                    console.error("Error opening tab:", chrome.runtime.lastError);
                    await clearGameStorage();
                } else {
                    currentGameStorage = await updateGameStorage({
                        id: game.id,
                        startingArticleUrl: game.startingArticleUrl,
                        endingArticleUrl: game.endingArticleUrl,
                        minSteps: game.minSteps,
                        visitedUrls: [game.startingArticleUrl],
                        hasWon: false,
                        tabId: tab.id || -1
                    });
                    gameStartedNotification(game.startingArticleUrl, game.endingArticleUrl, game.minSteps);
                }
            });
            break;
        default:
            console.warn("Unknown message type:", message.type);
            break;
    }
});

chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
    await refetchAndSetStorage();
    if (!currentGameStorage.hasWon && tabId === currentGameStorage.tabId) {
        closedTabNotification();
        let gameStorage = await getGameStorage();
        let authStorage = await getAuthStorage();
        await clearGameStorage();
        gameStorage = await getGameStorage();
        authStorage = await getAuthStorage();
    }
});

async function handleNewUrl(newUrl: string) {
    if (currentGameStorage.visitedUrls[currentGameStorage.visitedUrls.length - 1] === newUrl) {
        return; // Ignore if the URL is the same as the last visited URL
    }
    currentGameStorage = await updateGameStorage({
        visitedUrls: [...currentGameStorage.visitedUrls, newUrl]
    })
    if (areArticlesTheSame(newUrl, currentGameStorage.endingArticleUrl)) {
        try {
            await validateWin(currentGameStorage.id, currentGameStorage.visitedUrls);
            gameWonNotification(currentGameStorage.visitedUrls.length - 1);
        } catch (error) {
            invalidGameNotification();
            return;
        }
    }
}

chrome.webNavigation.onHistoryStateUpdated.addListener(async (details) => {
    await refetchAndSetStorage();
    if (currentGameStorage.hasWon) {
        return;
    }
    if (details.tabId !== currentGameStorage.tabId) {
        return; // Ignore navigation events from other tabs
    }
    const newUrl = details.url;
    await handleNewUrl(newUrl);
});

chrome.webNavigation.onCommitted.addListener(async (details) => {
    await refetchAndSetStorage();
    if (currentGameStorage.hasWon) {
        return;
    }
    if (details.tabId !== currentGameStorage.tabId) {
        return; // Ignore navigation events from other tabs
    }
    const newUrl = details.url;
    await handleNewUrl(newUrl);
});
